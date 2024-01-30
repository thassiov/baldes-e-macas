import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaldeService } from '../../services/balde';
import { EndpointHandlerError } from '../../utils/errors';
import { EndpointHandler } from '../../utils/types';

function listBaldesHandlerFactory(baldeService: BaldeService): EndpointHandler {
  return async function listBaldesHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const result = await baldeService.listBaldes();

      res.status(StatusCodes.OK).json({ baldes: result });
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'listBaldesHandler',
          request: {
            method: req.method,
            headers: req.headers,
            body: req.body,
            url: req.url,
          },
        },
      });
    }
  };
}

export { listBaldesHandlerFactory };
