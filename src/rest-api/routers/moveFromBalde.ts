import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { BaldeService } from '../../services/balde';
import { EndpointHandlerError } from '../../utils/errors';
import { EndpointHandler } from '../../utils/types';

const idSchema = z.number();

function moveFromBaldeHandlerFactory(
  baldeService: BaldeService
): EndpointHandler {
  return async function moveFromBaldeHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const baldeId = parseInt(req.params?.baldeId as string);
      const macaId = parseInt(req.params?.macaId as string);

      if (!idSchema.safeParse(baldeId).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'O formato do baldeId enviado e invalido',
        });
        return;
      }

      if (!idSchema.safeParse(macaId).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'O formato do macaId enviado e invalido',
        });
        return;
      }

      const result = await baldeService.moveFromBalde(baldeId, macaId);

      if (result.moved === 0) {
        if (result.message?.includes('maca nao existe')) {
          res.status(StatusCodes.NOT_FOUND).json({ message: result.message });
          return;
        }

        if (result.message?.includes('balde nao existe')) {
          res.status(StatusCodes.NOT_FOUND).json({ message: result.message });
          return;
        }

        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: result.message });
        return;
      }

      res.status(StatusCodes.OK).json({ result: true });
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'moveFromBaldeHandler',
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

export { moveFromBaldeHandlerFactory };
