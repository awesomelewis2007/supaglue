import initRoutes from '@/routes';
import { createTerminus } from '@godaddy/terminus';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import { HTTPError } from '@supaglue/core/errors';
import { expressScopeMiddleware, logger } from '@supaglue/core/lib';
import { distinctId } from '@supaglue/core/lib/distinct_identifier';
import { getSystemProperties, posthogClient } from '@supaglue/core/lib/posthog';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import promBundle from 'express-prom-bundle';
import fs from 'fs';
import path from 'path';
import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { getDependencyContainer } from './dependency_container';
import { posthogErrorMiddleware, posthogMiddleware } from './lib/posthog';

const sentryEnabled = !(process.env.SUPAGLUE_DISABLE_ERROR_REPORTING || process.env.CI) && process.env.SENTRY_DSN;
const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

if (sentryEnabled) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SUPAGLUE_ENVIRONMENT,
    integrations: [
      new RewriteFrames({
        root: __dirname,
      }),
    ],
    release: version,
    includeLocalVariables: true,
    initialScope: {
      user: {
        id: distinctId,
      },
    },
  });
}

const app = express();
const metricsApp = express();
const port = process.env.SUPAGLUE_API_PORT ? parseInt(process.env.SUPAGLUE_API_PORT) : 8080;

app.use(
  promBundle({
    includeMethod: true,
    includePath: true,
    promClient: {
      collectDefaultMetrics: {},
    },
    autoregister: false,
    metricsApp,
  })
);

app.use(Sentry.Handlers.requestHandler());
app.use(expressScopeMiddleware());

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors
app.use(
  cors({
    origin: process.env.SUPAGLUE_CORS_ORIGIN,
    credentials: true,
  })
);

app.use(posthogMiddleware);

app.use(
  pinoHttp({
    // TODO: Fix once version drift between pino and pino-http is resolved
    logger: logger as any,
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      }
      return 'info';
    },
    customSuccessMessage: function (req, res) {
      if (res.statusCode === 404) {
        return `${req.method} ${(req as Request).originalUrl} not found`;
      }
      return `${req.method} ${(req as Request).originalUrl}`;
    },
    customErrorMessage: function (req) {
      return `${req.method} ${(req as Request).originalUrl}`;
    },
    serializers: {
      req: (req) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { cookie, authorization, ['x-api-key']: apiKey, ...headers } = req.headers;
        return { ...req, headers };
      },
    },
    genReqId: () => uuidv4(),
    quietReqLogger: true, // only log the reqId from req.log.*, not the whole request
  })
);

// posthog
app.use(posthogMiddleware);

initRoutes(app);

// init the processSyncChanges schedule
const { connectionAndSyncService } = getDependencyContainer();
connectionAndSyncService.createProcessSyncChangesTemporalScheduleIfNotExist().catch((err) => {
  logger.error(err);
});

// error handling middlewares
app.use(posthogErrorMiddleware);
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError: (error) => {
      if (error instanceof HTTPError && error.code < 500) {
        return false;
      }
      return true;
    },
  })
);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  // add the error to the response so pino-http can log it
  res.err = err as Error;

  if (err instanceof HTTPError) {
    return res.status(err.code).send({
      errors: [
        {
          title: err.message,
          detail: err.cause?.message ?? err.message,
          problem_type: err.problemType,
        },
      ],
    });
  }

  return res.status(500).json({
    errors: [
      {
        title: 'Internal Server Error',
        detail: (err as any).message || 'Internal Server Error',
        problem_type: 'INTERNAL_SERVER_ERROR',
      },
    ],
  });
});

const server = app.listen(port, (): void => {
  if (!process.env.DISABLE_BANNER) {
    logger.info(`
 _______           _______  _______  _______  _                 _______
(  ____ \\|\\     /|(  ____ )(  ___  )(  ____ \\( \\      |\\     /|(  ____ \\
| (    \\/| )   ( || (    )|| (   ) || (    \\/| (      | )   ( || (    \\/
| (_____ | |   | || (____)|| (___) || |      | |      | |   | || (__
(_____  )| |   | ||  _____)|  ___  || | ____ | |      | |   | ||  __)
      ) || |   | || (      | (   ) || | \\_  )| |      | |   | || (
/\\____) || (___) || )      | )   ( || (___) || (____/\\| (___) || (____/\\
\\_______)(_______)|/       |/     \\|(_______)(_______/(_______)(_______/`);
  }
  logger.info(`Server listening on port ${port}`);

  if (distinctId) {
    posthogClient.capture({
      distinctId,
      event: 'API Server started',
      properties: {
        result: 'success',
        isDevelopmentMode: process.env.NODE_ENV === 'development',
        source: 'api',
        system: getSystemProperties(),
      },
    });
  }
});

const metricsServer = metricsApp.listen(9090, (): void => {
  logger.info('Metrics server listening on port 9090');
});

createTerminus(server, {
  healthChecks: {
    '/health': async () => {
      return;
    },
  },
  timeout: 10000,
  beforeShutdown: async () => {
    logger.info('Server is shutting down');
    metricsServer.close();
    await posthogClient.shutdownAsync();
  },
  onShutdown: async () => {
    logger.info('Server is shut down');
  },
  useExit0: true,
  logger: (message, error) => logger.error(error, message),
});
