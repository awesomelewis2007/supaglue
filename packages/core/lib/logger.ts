import pino, { Level, Logger } from 'pino';
// @ts-expect-error this package doesn't have types
import { addContext, wrapLogger } from 'pino-context';
import pretty from 'pino-pretty';
import { createWriteStream } from 'pino-sentry';
// @ts-expect-error this package doesn't have types
export { default as expressScopeMiddleware } from 'pino-context/integrations/express';
export { addLogContext };

// add a type for this since pino-context doesn't have any
const addLogContext: (key: string, value: unknown) => void = addContext;

const sentryEnabled = !(process.env.SUPAGLUE_DISABLE_ERROR_REPORTING || process.env.CI) && process.env.SENTRY_DSN;

const LOG_LEVEL = process.env.SUPAGLUE_LOG_LEVEL as Level;

const streams: (pino.DestinationStream | pino.StreamEntry)[] = [];
if (process.env.SUPAGLUE_PRETTY_LOGS) {
  streams.push(pretty({ translateTime: true, colorize: true }));
} else {
  streams.push({ stream: process.stdout });
}

if (sentryEnabled) {
  const sentryStream = createWriteStream({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SUPAGLUE_ENVIRONMENT,
    // Temporal logs all errors as warnings (with a stack trace), so we capture warnings to sentry as well.
    // TODO: Consider only doing this for sync-worker and not for api.
    level: (process.env.SENTRY_LOG_LEVEL as any) ?? 'error',
    decorateScope: (data, scope) => {
      scope.setTag('applicationId', data.applicationId as string);
      scope.setTag('connectionId', data.connectionId as string);
      scope.setTag('customerId', data.customerId as string);
      scope.setTag('orgId', data.orgId as string);
    },
  });
  streams.push(sentryStream);
}

// add a type for this since pino-context doesn't have any
export const logger: Logger = wrapLogger(
  pino(
    {
      level: LOG_LEVEL,
      base: undefined, // don't log hostname and pid
    },
    pino.multistream(streams)
  )
);
