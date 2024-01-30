import { CreateBaldeDto } from '../../models/balde';

type RemoveResult = {
  removed: number;
};

class BaldeRepository {
  async create(_: CreateBaldeDto): Promise<number> {
    return 1;
  }

  async remove(_: number): Promise<RemoveResult> {
    return { removed: 1 };
  }
}

export { BaldeRepository };
