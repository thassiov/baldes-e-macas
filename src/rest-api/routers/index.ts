import express from 'express';

import { Services } from '../../utils/types';
import { createBaldeHandlerFactory } from './createBalde';
import { createMacaHandlerFactory } from './createMaca';
import { listBaldesHandlerFactory } from './listBaldes';
import { moveFromBaldeHandlerFactory } from './moveFromBalde';
import { moveToBaldeHandlerFactory } from './moveToBalde';
import { removeBaldeHandlerFactory } from './removeBalde';

const router = express.Router();

router.use('/v1');

function setRouter(services: Services): express.Router {
  router.post('/baldes', createBaldeHandlerFactory(services.balde));
  router.get('/baldes', listBaldesHandlerFactory(services.balde));
  router.delete('/baldes/:id', removeBaldeHandlerFactory(services.balde));
  router.patch(
    '/baldes/:baldeId/adicionar/:macaId',
    moveToBaldeHandlerFactory(services.balde)
  );
  router.patch(
    '/baldes/:baldeId/remover/:macaId',
    moveFromBaldeHandlerFactory(services.balde)
  );
  router.post('/maca', createMacaHandlerFactory(services.maca));

  return router;
}

export { setRouter };
