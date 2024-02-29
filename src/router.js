import Router from '@koa/router';
import {healthcheck} from "./api/healthcheck.js";
import {routeToFunction} from "./middlewares.js";
import {throw422, throw500} from "./controllers/errors.js";
import {getNewsletter} from "./controllers/newsletters.js";
import {pong} from "./api/pong.js";

const router = new Router();

router.get('/healthcheck', routeToFunction(healthcheck));

router.get('/errors/422', routeToFunction(throw422));
router.get('/errors/500', routeToFunction(throw500));

router.get('/newsletters/:id', routeToFunction(getNewsletter));

router.get('/ping', routeToFunction(pong));

export default router;