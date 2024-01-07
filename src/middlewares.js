import koa_log from 'koa-better-log';
import nanoid from 'nano-id';
import path from 'path';

import asyncStorage from './asyncStorage.js';
import log from './log.js';

export const initAsyncStorage = async (ctx, next) => {
  const id_transaction = nanoid(10);
  ctx.set('x-transaction-id', id_transaction);
  ctx.state.id_transaction = id_transaction;

  const store = {
    headers: ctx.headers,
    id_transaction,
    request: {
      ip: ctx.ip,
    },
  };

  await asyncStorage.run(store, next);
};

export const routeSummaryLog = koa_log({
  logger: log.koa,
  json: false,
  logWith: (ctx) => {
    const log_with = {
      id_transaction: ctx.state.id_transaction,
      result: ctx.body,
    };
    if (ctx.response.status >= 400) {
      log_with.stack = ctx.state.stack;
      log_with.request_headers = ctx.request.headers;
      log_with.request_body = ctx.request.body;
      log_with.message = ctx.response.message;
    }
    return log_with;
  },
  exclude: (ctx) => process.env.MODE === 'test' || ctx.path.includes('healthcheck') || path.extname(ctx.path),
});

const ROUTES_SKIP_LOG = ['healthcheck'];

export const logIncomingCall = async (ctx, next) => {
  const pathname = ctx.request.originalUrl.split('?')[0];
  if (ROUTES_SKIP_LOG.some((exclude) => pathname.includes(exclude))) return await next();

  const http_method = ctx.request.method;

  const input_params = getContextParams(ctx);
  log.info(`Started ${http_method} for ${pathname}`, ...input_params);
  await next();
  log.info(`End ${http_method} for ${pathname}`);
};

export const routeToFunction =
  (func) =>
    async (ctx) => {
      const args = getContextParams(ctx);

      ctx.state.args = args;
      const body = await func(...args);

      if (body._http_code) {
        ctx.status = body._http_code;
        delete body._http_code;
      }
      ctx.body = body;
    };

const getContextParams = (ctx) => {
  let args;

  args = [
    {
      files: ctx.request.files,
      ...ctx.request.query,
      ...ctx.request.body,
      ...ctx.request.params,
    },
  ];

  return args;
};