import { distinctId } from '@supaglue/core/lib/distinct_identifier';
import { getSystemProperties, posthogClient } from '@supaglue/core/lib/posthog';
import { NextFunction, Request, Response } from 'express';

function getProviderNameFromRequest(req: Request) {
  let { providerName } = req.query;
  if (!providerName && 'state' in req.query && typeof req.query.state === 'string') {
    ({ providerName } = JSON.parse(req.query.state));
  }

  return providerName;
}

function onResFinished(req: Request, res: Response, err?: any) {
  if (!distinctId || res.locals.analyticsLogged) {
    return;
  }

  const error = err ?? res.locals.error;

  posthogClient.capture({
    distinctId,
    event: 'API Call',
    properties: {
      method: req.method,
      route: `${req.baseUrl}${req.route?.path ?? ''}`,
      params: req.params,
      providerName: getProviderNameFromRequest(req),
      query: req.query,
      result: error ? 'error' : 'success',
      error: error?.message,
      source: 'api',
      path: req.originalUrl,
      system: getSystemProperties(),
    },
  });
  res.locals.analyticsLogged = true;
}

export function posthogMiddleware(req: Request, res: Response, next: NextFunction) {
  const onResponseComplete = (err: any) => {
    res.removeListener('close', onResponseComplete);
    res.removeListener('finish', onResponseComplete);
    res.removeListener('error', onResponseComplete);

    return onResFinished(req, res, err);
  };

  res.on('close', onResponseComplete);
  res.on('finish', onResponseComplete);
  res.on('error', onResponseComplete);

  return next();
}

export function posthogErrorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  res.locals.error = err;
  return next(err);
}
