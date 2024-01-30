import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { BaldeService } from '../../services/balde';
import { EndpointHandler } from '../../utils/types';

const idSchema = z.number();

function moveToBaldeHandlerFactory(
  baldeService: BaldeService
): EndpointHandler {
  return async function moveToBaldeHandler(
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
      }

      if (!idSchema.safeParse(macaId).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'O formato do macaId enviado e invalido',
        });
      }

      const result = await baldeService.moveToBalde(baldeId, macaId);

      if (result.moved === 0) {
        if (result.message?.includes('cheio')) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: result.message });
          return;
        }

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
    } catch (error) {}
  };
}

export { moveToBaldeHandlerFactory };
