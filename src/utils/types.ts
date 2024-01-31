import { Request, Response } from 'express';

import { BaldeService } from '../services/balde';
import { MacaService } from '../services/maca';
import { MacaEvictionService } from '../services/maca-eviction';

export type RemoveResult = {
  removed: number;
  message?: string;
};

export type MoveResult = {
  moved: number;
  message?: string;
};

export type BaldeListResultItem = {
  id: number;
  nome: string;
  capacidade: number;
  ocupacao: number;
  valorTotal: number;
};

export type EndpointHandler = (req: Request, res: Response) => Promise<void>;

export type Services = {
  maca: MacaService;
  balde: BaldeService;
  monitoramento: MacaEvictionService;
};
