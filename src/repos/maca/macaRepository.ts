import { ModelStatic, Op, Sequelize, Transaction } from 'sequelize';

import { ICreateMacaDto, Maca } from '../../models/maca';
import { RepositoryError } from '../../utils/errors';

type RemoveResult = {
  removed: number;
};

type MoveResult = {
  moved: number;
};

class MacaRepository {
  db: ModelStatic<Maca>;

  constructor(private readonly sequelize: Sequelize) {
    this.db = this.sequelize.model('maca');
  }

  async create(macaDto: ICreateMacaDto): Promise<number> {
    const transaction = await this.getTransaction();
    try {
      const result = await this.db.create(macaDto, { transaction });
      await transaction.commit();
      return result.get('id') as number;
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Erro ao criar nova maca no banco de dados', {
        cause: error as Error,
        details: {
          input: macaDto,
        },
      });
    }
  }

  async remove(macaId: number): Promise<RemoveResult> {
    const transaction = await this.getTransaction();
    try {
      const result = await this.db.destroy({
        transaction,
        where: {
          id: {
            [Op.eq]: macaId,
          },
        },
      });

      await transaction.commit();

      return { removed: result };
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Erro ao remover maca do banco de dados', {
        cause: error as Error,
        details: {
          input: macaId,
        },
      });
    }
  }

  async exists(macaId: number): Promise<boolean> {
    try {
      const result = await this.db.findOne<Maca>({
        where: { id: { [Op.eq]: macaId } },
      });

      if (result === null) {
        return false;
      }

      return true;
    } catch (error) {
      throw new RepositoryError('Error ao remover maca dobanco de dados', {
        cause: error as Error,
        details: {
          input: macaId,
        },
      });
    }
  }

  async moveToBalde(macaId: number, baldeID: number): Promise<MoveResult> {
    const transaction = await this.getTransaction();
    try {
      const maca = await this.db.update<Maca>(
        { baldeId: baldeID },
        {
          where: {
            id: {
              [Op.eq]: macaId,
            },
            baldeId: {
              [Op.or]: [
                {
                  [Op.eq]: null,
                },
                {
                  [Op.not]: baldeID,
                },
              ],
            },
          },
        }
      );
      await transaction.commit();

      return { moved: maca[0] };
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError(
        'Erro ao registrar relacao entre maca e balde',
        {
          cause: error as Error,
          details: {
            input: { macaId, baldeId: baldeID },
          },
        }
      );
    }
  }

  async moveFromBalde(macaId: number, baldeId: number): Promise<MoveResult> {
    const transaction = await this.getTransaction();
    try {
      const maca = await this.db.update<Maca>(
        { baldeId: null },
        {
          where: {
            id: {
              [Op.eq]: macaId,
            },
            baldeId: {
              [Op.eq]: baldeId,
            },
          },
        }
      );
      await transaction.commit();

      return { moved: maca[0] };
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Erro ao desfazer relacao entre maca e balde', {
        cause: error as Error,
        details: {
          input: { macaId, baldeId },
        },
      });
    }
  }

  async getMacasIdAndExpiration(): Promise<{ id: number; expiracao: Date }[]> {
    try {
      const macas = await this.db.findAll();

      const macasExpiracao = macas.map((maca) => ({
        id: maca.get('id') as number,
        expiracao: maca.get('expiracaoDate') as Date,
      })) as { id: number; expiracao: Date }[];

      return macasExpiracao;
    } catch (error) {
      throw new RepositoryError('Erro ao listar macas no banco de dados', {
        cause: error as Error,
      });
    }
  }

  private async getTransaction(): Promise<Transaction> {
    const t = await this.sequelize.transaction();
    return t;
  }
}

export { MacaRepository };
