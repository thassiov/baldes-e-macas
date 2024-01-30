import { Sequelize } from 'sequelize';

import { ICreateMacaDto } from '../../models/maca';

type RemoveResult = {
  removed: number;
};

type MoveResult = {
  moved: number;
};

class MacaRepository {
  constructor(private readonly db: Sequelize) {}

  async create(_: ICreateMacaDto): Promise<number> {
    this.db;
    return 1;
  }

  async remove(_: number): Promise<RemoveResult> {
    this.db;
    return { removed: 1 };
  }

  async exists(_: number): Promise<boolean> {
    this.db;
    return true;
  }

  async moveToBalde(_b: number, _m: number): Promise<MoveResult> {
    return { moved: 1 };
  }

  async moveFromBalde(_b: number, _m: number): Promise<MoveResult> {
    return { moved: 1 };
  }
}

export { MacaRepository };
