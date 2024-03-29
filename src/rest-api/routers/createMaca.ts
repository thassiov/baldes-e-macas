import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createMacaDtoSchema } from '../../models';
import { MacaService } from '../../services/maca';
import { MacaEvictionService } from '../../services/maca-eviction';
import { EndpointHandlerError } from '../../utils/errors';
import { EndpointHandler } from '../../utils/types';

function createMacaHandlerFactory(
  macaService: MacaService,
  monitoramento: MacaEvictionService
): EndpointHandler {
  return async function createMacaHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!createMacaDtoSchema.safeParse(req.body).success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'O formato de maca enviado e invalido',
        });
        return;
      }

      const { id, expiracao } = await macaService.create(req.body);
      monitoramento.adicionarMacaAListadeMonitoramentoDeValidade({
        id,
        expiracao,
      });

      res.status(StatusCodes.CREATED).json({ id });
    } catch (error) {
      if ((error as Error).message.includes('0 segundos')) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: (error as Error).message,
        });
        return;
      }

      throw new EndpointHandlerError('Error processing request', {
        cause: error as Error,
        details: {
          handler: 'createMacaHandler',
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

export { createMacaHandlerFactory };
