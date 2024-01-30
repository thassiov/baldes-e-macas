import { Sequelize } from 'sequelize';

import { ICreateBaldeDto } from '../../models/balde';
import { BaldeListResultItem } from '../../utils/types';

type RemoveResult = {
  removed: number;
};

type OcupacaoECapacidadeResult = {
  capacidade: number;
  ocupacao: number;
};

class BaldeRepository {
  constructor(private readonly db: Sequelize) {}
  async create(_: ICreateBaldeDto): Promise<number> {
    this.db;
    return 1;
  }

  async remove(_: number): Promise<RemoveResult> {
    this.db;
    return { removed: 1 };
  }

  async ocupacaoECapacidade(_: number): Promise<OcupacaoECapacidadeResult> {
    return { ocupacao: 1, capacidade: 1 };
  }

  async listBaldes(): Promise<BaldeListResultItem[]> {
    this.db;
    return [];
  }
}

export { BaldeRepository };
