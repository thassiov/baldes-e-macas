import { CreateMacaDto } from '../../models/maca';

class MacaRepository {
  async create(_: CreateMacaDto): Promise<number> {
    return 1;
  }

  async remove(_: number): Promise<boolean> {
    return true;
  }
}

export { MacaRepository };
