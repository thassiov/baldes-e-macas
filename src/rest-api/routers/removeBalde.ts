import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { BaldeService } from '../../services/balde';
import { EndpointHandlerError } from '../../utils/errors';
import { EndpointHandler } from '../../utils/types';

const idSchema = z.number();

function removeBaldeHandlerFactory(
  baldeService: BaldeService
): EndpointHandler {
  return async function removeBaldeHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const baldeId = parseInt(req.params?.id as string);

      if (!idSchema.safeParse(baldeId).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'O formato do baldeId enviado e invalido',
        });
        return;
      }

      const result = await baldeService.remove(baldeId);

      if (result.removed === 0) {
        if (result.message?.includes('nao existe')) {
          res.status(StatusCodes.NOT_FOUND).json({ message: result.message });
          return;
        }

        if (result.message?.includes('nao esta vazio')) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: result.message });
          return;
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Nao foi possivel remover o balde',
        });
        return;
      }

      res.status(StatusCodes.NO_CONTENT).send();
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'removeBaldeHandler',
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

export { removeBaldeHandlerFactory };
