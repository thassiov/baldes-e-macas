import { ModelStatic, Op, Sequelize, Transaction } from 'sequelize';

import { Maca } from '../../models';
import { Balde, ICreateBaldeDto } from '../../models/balde';
import { RepositoryError } from '../../utils/errors';
import { BaldeListResultItem } from '../../utils/types';

type RemoveResult = {
  removed: number;
};

type OcupacaoECapacidadeResult = {
  capacidade: number;
  ocupacao: number;
};

class BaldeRepository {
  db: ModelStatic<Balde>;

  constructor(private readonly sequelize: Sequelize) {
    this.db = this.sequelize.model('balde');
  }

  async create(baldeDto: ICreateBaldeDto): Promise<number> {
    const transaction = await this.getTransaction();
    try {
      const result = await this.db.create(baldeDto, { transaction });
      await transaction.commit();
      return result.get('id') as number;
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Erro ao criar novo balde no banco de dados', {
        cause: error as Error,
        details: {
          input: baldeDto,
        },
      });
    }
  }

  async remove(baldeId: number): Promise<RemoveResult> {
    const transaction = await this.getTransaction();
    try {
      const result = await this.db.destroy({
        transaction,
        where: {
          id: {
            [Op.eq]: baldeId,
          },
        },
      });

      await transaction.commit();

      return { removed: result };
    } catch (error) {
      await transaction.rollback();
      throw new RepositoryError('Erro ao remover balde do banco de dados', {
        cause: error as Error,
        details: {
          input: baldeId,
        },
      });
    }
  }

  async ocupacaoECapacidade(
    baldeId: number
  ): Promise<OcupacaoECapacidadeResult> {
    try {
      const balde = await this.db.findOne<Balde>({
        attributes: [
          [
            this.sequelize.literal(
              '(SELECT COUNT(*) FROM macas WHERE balde.id = macas.baldeId)'
            ),
            'ocupacao',
          ],
          'capacidade',
        ],
        where: {
          id: {
            [Op.eq]: baldeId,
          },
        },
        include: {
          model: Maca,
          attributes: [],
        },
      });

      if (!balde) {
        throw new Error('O balde nao existe');
      }

      return {
        ocupacao: balde.get('ocupacao') as number,
        capacidade: balde.get('capacidade') as number,
      };
    } catch (error) {
      throw new RepositoryError('Erro ao retornar informacoes do balde', {
        cause: error as Error,
        details: {
          input: baldeId,
        },
      });
    }
  }

  async listBaldes(): Promise<BaldeListResultItem[]> {
    try {
      const baldes = await this.db.findAll<Balde>({
        attributes: [
          [
            this.sequelize.literal(
              '(SELECT SUM(preco) FROM maca WHERE balde.id = maca.baldeId)'
            ),
            'valorTotal',
          ],
          [
            this.sequelize.literal(
              '(SELECT COUNT(*) FROM maca WHERE balde.id = maca.baldeId)'
            ),
            'ocupacao',
          ],
        ],
        include: {
          model: Maca,
          attributes: [],
        },
      });

      if (!baldes.length) {
        return [];
      }

      const result = baldes.map((balde) => {
        const ocupacao = Math.round(
          ((balde.get('ocupacao') as number) /
            (balde.dataValues.capacidade as number)) *
            100
        );

        return {
          ocupacao,
          id: balde.dataValues.id as number,
          nome: balde.dataValues.nome as string,
          capacidade: balde.dataValues.capacidade as number,
          valorTotal: balde.get('total') as number,
        };
      });

      return result;
    } catch (error) {
      throw new RepositoryError('Erro ao retornar informacoes do balde', {
        cause: error as Error,
      });
    }
  }

  private async getTransaction(): Promise<Transaction> {
    const t = await this.sequelize.transaction();
    return t;
  }
}

export { BaldeRepository };
