import { ICreateMacaDto } from '../../models/maca';
import { MacaRepository } from '../../repos/maca';
import { ServiceError, ValidationError } from '../../utils/errors';
import { MoveResult } from '../../utils/types';

export type RemoveResult = {
  removed: number;
  message?: string;
};

class MacaService {
  constructor(private readonly repo: MacaRepository) {}

  async create(maca: ICreateMacaDto): Promise<number> {
    try {
      const expiracaoSegundos = parseInt(maca.expiracao.slice(0, -1));

      if (expiracaoSegundos <= 0) {
        throw new ValidationError('A expiracao deve ser maior que 0 segundos', {
          details: { input: maca },
        });
      }

      maca.expiracaoDate = new Date(Date.now() + expiracaoSegundos * 1000);

      return this.repo.create(maca);
    } catch (error) {
      throw new ServiceError('Erro ao criar nova maca', {
        cause: error as Error,
        details: { input: maca },
      });
    }
  }

  async remove(macaId: number): Promise<RemoveResult> {
    try {
      const { removed } = await this.repo.remove(macaId);

      if (removed === 0) {
        return { removed: 0 };
      }

      return { removed };
    } catch (error) {
      throw new ServiceError('Erro ao remover maca', {
        cause: error as Error,
        details: { input: macaId },
      });
    }
  }

  async exists(macaId: number): Promise<boolean> {
    try {
      return this.repo.exists(macaId);
    } catch (error) {
      throw new ServiceError('Erro ao verificar se a maca existe', {
        cause: error as Error,
        details: { input: macaId },
      });
    }
  }

  async moveToBalde(macaId: number, baldeId: number): Promise<MoveResult> {
    try {
      return this.repo.moveToBalde(macaId, baldeId);
    } catch (error) {
      throw new ServiceError('Erro ao mover maca para o balde', {
        cause: error as Error,
        details: { input: { macaId, baldeId } },
      });
    }
  }

  async moveFromBalde(macaId: number, baldeId: number): Promise<MoveResult> {
    try {
      return this.repo.moveFromBalde(macaId, baldeId);
    } catch (error) {
      throw new ServiceError('Erro ao remover a maca do balde', {
        cause: error as Error,
        details: { input: { macaId, baldeId } },
      });
    }
  }
}

export { MacaService };
