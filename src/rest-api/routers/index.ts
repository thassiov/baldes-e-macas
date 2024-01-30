import express from 'express';

import { Services } from '../../utils/types';
import { createBaldeHandlerFactory } from './createBalde';
import { listBaldesHandlerFactory } from './listBaldes';
import { removeBaldeHandlerFactory } from './removeBalde';

const router = express.Router();

router.use('/v1');

function setRouter(services: Services): express.Router {
  router.post('/baldes', createBaldeHandlerFactory(services.balde));
  router.get('/baldes', listBaldesHandlerFactory(services.balde));
  router.delete('/baldes/:id', removeBaldeHandlerFactory(services.balde));

  return router;
}

export { setRouter };
