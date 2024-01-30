import { CreateBaldeDto } from '../../models/balde';
import { BaldeRepository } from '../../repos/balde';
import { ServiceError } from '../../utils/errors';

class BaldeService {
  constructor(private readonly repo: BaldeRepository) {}

  async create(balde: CreateBaldeDto): Promise<number> {
    try {
      return this.repo.create(balde);
    } catch (error) {
      throw new ServiceError('Erro ao criar novo balde', {
        cause: error as Error,
        details: { input: balde },
      });
    }
  }

  async remove(baldeId: number): Promise<boolean> {
    try {
      return this.repo.remove(baldeId);
    } catch (error) {
      throw new ServiceError('Erro ao remover balde', {
        cause: error as Error,
        details: { input: baldeId },
      });
    }
  }
}

export { BaldeService };
