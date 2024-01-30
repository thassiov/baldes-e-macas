import express from 'express';
import pinoHttp from 'pino-http';

import { configs } from '../utils/configs';
import { logger } from '../utils/logger';
import { Services } from '../utils/types';
import { setRouter } from './routers';

const api = express();

api.use(express.json());
api.use(express.urlencoded());
api.use(pinoHttp());

function startApi(services: Services) {
  const router = setRouter(services);
  api.use(router);

  api.listen(configs.API_PORT, () =>
    logger.info(`Server started at http://0.0.0.0:${configs.API_PORT}`)
  );
}

export { startApi };
