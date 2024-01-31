import { ICreateBaldeDto } from '../../models/balde';
import { BaldeRepository } from '../../repos/balde';
import { ServiceError } from '../../utils/errors';
import {
  BaldeListResultItem,
  MoveResult,
  RemoveResult,
} from '../../utils/types';
import { MacaService } from '../maca';

class BaldeService {
  constructor(
    private readonly repo: BaldeRepository,
    private readonly macaService: MacaService
  ) {}

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
      const { ocupacao } = await this.repo.ocupacaoECapacidade(baldeId);

      if (ocupacao > 0) {
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
      if ((error as Error).message === 'O balde nao existe') {
        return { removed: 0, message: 'O balde nao existe' };
      }

      throw new ServiceError('Erro ao remover balde', {
        cause: error as Error,
        details: { input: baldeId },
      });
    }
  }

  async moveToBalde(baldeId: number, macaId: number): Promise<MoveResult> {
    try {
      // cria uma excessao caso o balde nao exista
      const { ocupacao, capacidade } =
        await this.repo.ocupacaoECapacidade(baldeId);

      if (ocupacao === capacidade) {
        return { moved: 0, message: 'O balde esta cheio' };
      }

      const macaExiste = await this.macaService.exists(macaId);

      if (!macaExiste) {
        return { moved: 0, message: `A maca nao existe` };
      }

      const { moved } = await this.macaService.moveToBalde(macaId, baldeId);

      if (moved === 0) {
        return {
          moved: 0,
          message: 'Nao foi possivel mover a maca para o balde',
        };
      }

      return { moved };
    } catch (error) {
      if ((error as Error).message === 'O balde nao existe') {
        return { moved: 0, message: 'O balde nao existe' };
      }

      throw new ServiceError('Erro ao mover maca para o balde', {
        cause: error as Error,
        details: { input: { macaId, baldeId } },
      });
    }
  }

  async moveFromBalde(baldeId: number, macaId: number): Promise<MoveResult> {
    try {
      // cria uma excessao caso o balde nao exista
      await this.repo.ocupacaoECapacidade(baldeId);

      const macaExiste = await this.macaService.exists(macaId);

      if (!macaExiste) {
        return { moved: 0, message: `A maca nao existe` };
      }

      const { moved } = await this.macaService.moveFromBalde(macaId, baldeId);

      if (moved === 0) {
        return {
          moved: 0,
          message: 'Nao foi possivel remover a maca do balde',
        };
      }

      return { moved };
    } catch (error) {
      if ((error as Error).message === 'O balde nao existe') {
        return { moved: 0, message: 'O balde nao existe' };
      }

      throw new ServiceError('Erro ao remover maca do balde', {
        cause: error as Error,
        details: { input: { macaId, baldeId } },
      });
    }
  }

  async listBaldes(): Promise<BaldeListResultItem[]> {
    try {
      return this.repo.listBaldes();
    } catch (error) {
      throw new ServiceError('Erro ao consultar a lista de baldes', {
        cause: error as Error,
      });
    }
  }
}

export { BaldeService };
