import { CreateBaldeDto } from '../../models/balde';

class BaldeRepository {
  async create(_: CreateBaldeDto): Promise<number> {
    return 1;
  }

  async remove(_: number): Promise<boolean> {
    return true;
  }
}

export { BaldeRepository };
