import cors from '@koa/cors';
import http from 'http';
import Koa from 'koa';
import json from 'koa-better-json';
import {koaBody} from 'koa-body';
import {APIError404, APIError405, APIError415, apiErrorManager} from './errors.js';
import log from './log.js';
import {
  initAsyncStorage,
  logIncomingCall,
  routeSummaryLog
} from './middlewares.js';
import router from './router.js';

process.on('uncaughtException', (e) => log.error('uncaughtException', e));
process.on('unhandledRejection', (e) => log.error('unhandledRejection', e));

const app = new Koa();

const body_limits = {
  formLimit: '64mb',
  jsonLimit: '64mb',
  formidable: {maxFileSize: '64mb', multiples: true},
  multipart: true,
};

app.use(cors({exposeHeaders: ['x-version']}));
app.use(koaBody(body_limits));
app.use(json());
app.use(initAsyncStorage);
app.use(routeSummaryLog);
app.use(logIncomingCall);

app.use(async (ctx, next) => {
  try {
    ctx.set('x-version', process.env.npm_package_version);
    await next();
    if (!ctx.body) {
      // if body is not defined at this moment, it means that no route matched the request, so a 404 error is fired.
      throw new APIError404();
    }
  } catch (error) {
    apiErrorManager(ctx, error); // error handler
  }
});

app.use(router.routes());
app.use(
  router.allowedMethods({
    throw: true,
    notImplemented: () => new APIError415(),
    methodNotAllowed: () => new APIError405(),
  }),
);

const server = http.createServer(app.callback());
export default server;

server.listen(process.env.PORT, async (error) => {
  if (error) {
    log.error(error);
  } else {
    log.info(`http serving on port ${process.env.PORT}`);
  }
});