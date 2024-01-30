import { CreateMacaDto } from '../../models/maca';

type RemoveResult = {
  removed: number;
};

class MacaRepository {
  async create(_: CreateMacaDto): Promise<number> {
    return 1;
  }

  async remove(_: number): Promise<RemoveResult> {
    return { removed: 1 };
  }
}

export { MacaRepository };
