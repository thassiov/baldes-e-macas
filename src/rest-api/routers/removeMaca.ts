import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { MacaService } from '../../services/maca';
import { MacaEvictionService } from '../../services/maca-eviction';
import { EndpointHandlerError } from '../../utils/errors';
import { EndpointHandler } from '../../utils/types';

const idSchema = z.number();

function removeMacaHandlerFactory(
  macaService: MacaService,
  monitoramento: MacaEvictionService
): EndpointHandler {
  return async function removeMacaHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const macaId = parseInt(req.params?.id as string);

      if (!idSchema.safeParse(macaId).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'O formato da macaId enviado e invalido',
        });
        return;
      }

      const result = await macaService.remove(macaId);

      if (result.removed === 0) {
        if (result.message?.includes('nao existe')) {
          res.status(StatusCodes.NOT_FOUND).json({ message: result.message });
          return;
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Nao foi possivel remover a maca',
        });
        return;
      }

      monitoramento.removerMacaDaListadeMonitoramentoDeValidade(macaId);

      res.status(StatusCodes.NO_CONTENT).send();
      return;
    } catch (error) {
      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'removeMacaHandler',
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

export { removeMacaHandlerFactory };
