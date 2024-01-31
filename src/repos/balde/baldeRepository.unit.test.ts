import { Sequelize, Transaction } from 'sequelize';

import { Balde, ICreateBaldeDto } from '../../models';
import { BaldeListResultItem } from '../../utils/types';
import { BaldeRepository } from './baldeRepository';

jest.mock('sequelize');

describe('Balde repo', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('criacao', () => {
    it('cria um novo balde', async () => {
      const mockBalde = {
        capacidade: 1,
        nome: 'balde A',
      } as ICreateBaldeDto;

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Balde, 'create').mockResolvedValueOnce({
        get: () => 1,
      });

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Balde);

      const baldeRepository = new BaldeRepository(sequelize);

      const result = await baldeRepository.create(mockBalde);

      expect(result).toEqual(1);
    });

    it('falha durante a criacao de um novo balde', async () => {
      const mockBalde = {
        capacidade: 1,
        nome: 'balde A',
      } as ICreateBaldeDto;

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Balde, 'create').mockRejectedValueOnce(new Error('db error'));

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Balde);

      const baldeRepository = new BaldeRepository(sequelize);

      expect(() => baldeRepository.create(mockBalde)).rejects.toThrow(
        'Erro ao criar novo balde no banco de dados'
      );
    });
  });

  describe('remocao', () => {
    it('remove um balde existente', async () => {
      const mockBaldeId = 1;
      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Balde, 'destroy').mockResolvedValueOnce(1);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Balde);

      const baldeRepository = new BaldeRepository(sequelize);

      const result = await baldeRepository.remove(mockBaldeId);

      expect(result.removed).toEqual(1);
    });

    it('falha ao tentar remover um balde inexistente', async () => {
      const mockBaldeId = 1;
      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Balde, 'destroy').mockResolvedValueOnce(0);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Balde);

      const baldeRepository = new BaldeRepository(sequelize);

      const result = await baldeRepository.remove(mockBaldeId);

      expect(result.removed).toEqual(0);
    });
  });

  describe('capacidade e ocupacao', () => {
    it('verifica a capacidade e ocupacao de um balde', async () => {
      const mockBaldeId = 1;
      const sequelize = new Sequelize();

      jest.spyOn(Balde, 'findOne').mockResolvedValueOnce({
        get: () => 1,
      } as Balde);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Balde);

      const baldeRepository = new BaldeRepository(sequelize);

      const result = await baldeRepository.ocupacaoECapacidade(mockBaldeId);

      expect(result.capacidade).toEqual(1);
      expect(result.ocupacao).toEqual(1);
    });

    it('falha ao verificar a capacidade de um balde que nao existe', async () => {
      const mockBaldeId = 1;
      const sequelize = new Sequelize();

      jest.spyOn(Balde, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Balde);

      const baldeRepository = new BaldeRepository(sequelize);

      expect(() =>
        baldeRepository.ocupacaoECapacidade(mockBaldeId)
      ).rejects.toThrow('O balde nao existe');
    });
  });

  describe('listar baldes', () => {
    it('lista baldes com porcentagem de ocupacao e soma dos valores do conteudo', async () => {
      const sequelize = new Sequelize();

      jest.spyOn(Balde, 'findAll').mockResolvedValueOnce([
        {
          dataValues: {
            id: 1,
            nome: 'A',
            capacidade: 1,
          },
          get: (arg: string) => {
            if (arg === 'nome') {
              return 'A';
            }

            return 1;
          },
        } as Balde,
      ]);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Balde);

      const baldeRepository = new BaldeRepository(sequelize);

      const result = await baldeRepository.listBaldes();

      const balde = result[0] as BaldeListResultItem;

      expect(balde.id).toEqual(1);
      expect(balde.nome).toEqual('A');
      expect(balde.capacidade).toEqual(1);
      expect(balde.ocupacao).toEqual(100);
      expect(balde.valorTotal).toEqual(1);
    });
  });
});
