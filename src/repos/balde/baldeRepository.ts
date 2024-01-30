import { ICreateBaldeDto } from '../../models/balde';

type RemoveResult = {
  removed: number;
};

class BaldeRepository {
  async create(_: ICreateBaldeDto): Promise<number> {
    return 1;
  }

  async remove(_: number): Promise<RemoveResult> {
    return { removed: 1 };
  }

  async isEmpty(_: number): Promise<boolean> {
    return true;
  }

  async getAll(): Promise<[]> {
    return [];
  }
}

export { BaldeRepository };
