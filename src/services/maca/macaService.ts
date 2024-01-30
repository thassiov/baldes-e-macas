import { ICreateMacaDto } from '../../models/maca';
import { MacaRepository } from '../../repos/maca';
import { ServiceError, ValidationError } from '../../utils/errors';

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

  async remove(macaId: number): Promise<boolean> {
    try {
      const { removed } = await this.repo.remove(macaId);

      if (removed === 0) {
        return false;
      }

      return true;
    } catch (error) {
      throw new ServiceError('Erro ao remover maca', {
        cause: error as Error,
        details: { input: macaId },
      });
    }
  }
}

export { MacaService };
