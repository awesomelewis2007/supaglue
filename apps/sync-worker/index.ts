import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import { logger } from '@supaglue/core/lib';
import { distinctId } from '@supaglue/core/lib/distinct_identifier';
import { createActivities } from '@supaglue/sync-workflows';
import { SYNC_TASK_QUEUE } from '@supaglue/sync-workflows/constants';
import {
  appendDefaultInterceptors,
  LogLevel,
  LogMetadata,
  NativeConnection,
  Runtime,
  Worker,
} from '@temporalio/worker';
import fs from 'fs';
import path from 'path';
import { getDependencyContainer } from './dependency_container';
import ActivityLogInterceptor from './interceptors/activity_log_interceptor';

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

const TEMPORAL_ADDRESS =
  process.env.SUPAGLUE_TEMPORAL_HOST && process.env.SUPAGLUE_TEMPORAL_PORT
    ? `${process.env.SUPAGLUE_TEMPORAL_HOST}:${process.env.SUPAGLUE_TEMPORAL_PORT}`
    : process.env.SUPAGLUE_TEMPORAL_HOST
    ? `${process.env.SUPAGLUE_TEMPORAL_HOST}:7233`
    : 'temporal';

async function run() {
  // pino expects errors to be placed under the `err` key. We're doing mapping here
  // instead of configuring it in `logger.ts` because we may use the pino logger
  // elsewhere in this app ourselves.
  // TODO: come up with better way to deal with this?

  const transformMeta = (meta?: LogMetadata): LogMetadata | undefined => {
    if (!meta) {
      return meta;
    }

    const { error, ...rest } = meta;
    if (!error) {
      return meta;
    }

    // TODO: don't assume that `error` is an error object
    return {
      ...rest,
      err: error,
    };
  };

  Runtime.install({
    logger: {
      info: (message: string, meta?: LogMetadata) => logger.info(transformMeta(meta), message),
      warn: (message: string, meta?: LogMetadata) => logger.warn(transformMeta(meta), message),
      error: (message: string, meta?: LogMetadata) => logger.error(transformMeta(meta), message),
      log: (level: LogLevel, message: string, meta?: LogMetadata) => logger.info(transformMeta(meta), message),
      trace: (message: string, meta?: LogMetadata) => logger.trace(transformMeta(meta), message),
      debug: (message: string, meta?: LogMetadata) => logger.debug(transformMeta(meta), message),
    },
    telemetryOptions: {
      metrics: {
        prometheus: {
          bindAddress: '0.0.0.0:9090',
        },
      },
    },
  });

  const connection = await NativeConnection.connect({
    address: TEMPORAL_ADDRESS,
    tls: fs.existsSync('/etc/temporal/temporal.pem')
      ? {
          clientCertPair: {
            crt: fs.readFileSync('/etc/temporal/temporal.pem'),
            key: fs.readFileSync('/etc/temporal/temporal.key'),
          },
        }
      : undefined,
  });

  const worker = await Worker.create({
    workflowsPath: require.resolve('@supaglue/sync-workflows/workflows'),
    // When interceptors.activityInbound is not registered, Temporal by default registers
    // ActivityInboundLogInterceptor and WorkflowInboundLogInterceptor
    activities: createActivities(getDependencyContainer()),
    taskQueue: SYNC_TASK_QUEUE,
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE ?? 'default',
    interceptors: appendDefaultInterceptors({
      activityInbound: [(ctx) => new ActivityLogInterceptor(ctx)],
      workflowModules: [`${__dirname}/interceptors/workflow_log_interceptor`],
    }),
  });

  await worker.run();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
