import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createBaldeDtoSchema } from '../../models';
import { BaldeService } from '../../services/balde';
import { EndpointHandlerError } from '../../utils/errors';
import { EndpointHandler } from '../../utils/types';

function createBaldeHandlerFactory(
  baldeService: BaldeService
): EndpointHandler {
  return async function createBaldeHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!createBaldeDtoSchema.safeParse(req.body).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'O formato de balde enviado e invalido',
        });

        return;
      }

      const result = await baldeService.create(req.body);

      res.status(StatusCodes.CREATED).json({ id: result });
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'createBaldeHandler',
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

export { createBaldeHandlerFactory };
