import express from 'express';

import { Services } from '../../utils/types';
import { createBaldeHandlerFactory } from './createBalde';

const router = express.Router();

router.use('/v1');

function setRouter(services: Services): express.Router {
  router.post('/baldes', createBaldeHandlerFactory(services.balde));

  return router;
}

export { setRouter };
