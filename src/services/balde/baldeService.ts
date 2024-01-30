import { ICreateBaldeDto } from '../../models/balde';
import { BaldeRepository } from '../../repos/balde';
import { ServiceError } from '../../utils/errors';

export type RemoveResult = {
  removed: number;
  message?: string;
};

class BaldeService {
  constructor(private readonly repo: BaldeRepository) {}

  async create(balde: ICreateBaldeDto): Promise<number> {
    try {
      return this.repo.create(balde);
    } catch (error) {
      throw new ServiceError('Erro ao criar novo balde', {
        cause: error as Error,
        details: { input: balde },
      });
    }
  }

  async remove(baldeId: number): Promise<RemoveResult> {
    try {
      const isEmpty = await this.repo.isEmpty(baldeId);

      if (!isEmpty) {
        return {
          removed: 0,
          message: 'O balde nao esta vazio e por isso nao pode ser removido',
        };
      }

      const { removed } = await this.repo.remove(baldeId);

      if (removed === 0) {
        return { removed: 0 };
      }

      return { removed };
    } catch (error) {
      throw new ServiceError('Erro ao remover balde', {
        cause: error as Error,
        details: { input: baldeId },
      });
    }
  }
}

export { BaldeService };
