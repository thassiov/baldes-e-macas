import { Sequelize, Transaction } from 'sequelize';

import { ICreateMacaDto, Maca } from '../../models';
import { MacaRepository } from './macaRepository';

jest.mock('sequelize');

describe('Maca repo', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('criacao', () => {
    it('cria uma nova maca', async () => {
      const mockMaca = {
        preco: 1.5,
        nome: 'maca',
        expiracao: '10s',
        expiracaoDate: new Date(),
      } as ICreateMacaDto;

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Maca, 'create').mockResolvedValueOnce({
        get: () => 1,
      });

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      const result = await macaRepository.create(mockMaca);

      expect(result).toEqual(1);
    });

    it('falha durante a criacao de uma nova maca', async () => {
      const mockMaca = {
        preco: 1.5,
        nome: 'maca',
        expiracao: '10s',
        expiracaoDate: new Date(),
      } as ICreateMacaDto;

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Maca, 'create').mockRejectedValueOnce(new Error('db error'));

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      expect(() => macaRepository.create(mockMaca)).rejects.toThrow(
        'Erro ao criar nova maca no banco de dados'
      );
    });
  });

  describe('remocao', () => {
    it('remove uma maca existente', async () => {
      const mockMacaId = 1;
      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Maca, 'destroy').mockResolvedValueOnce(1);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      const result = await macaRepository.remove(mockMacaId);

      expect(result.removed).toEqual(1);
    });

    it('falha ao tentar remover uma maca inexistente', async () => {
      const mockMacaId = 1;
      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Maca, 'destroy').mockResolvedValueOnce(0);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      const result = await macaRepository.remove(mockMacaId);

      expect(result.removed).toEqual(0);
    });
  });

  describe('verifica existencia', () => {
    it('verifica se uma maca existe (verdadeiro)', async () => {
      const mockMacaId = 1;
      const sequelize = new Sequelize();

      jest.spyOn(Maca, 'findOne').mockResolvedValueOnce({} as Maca);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      const result = await macaRepository.exists(mockMacaId);

      expect(result).toEqual(true);
    });

    it('verifica se uma maca existe (falso)', async () => {
      const mockMacaId = 1;
      const sequelize = new Sequelize();

      jest.spyOn(Maca, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      const result = await macaRepository.exists(mockMacaId);

      expect(result).toEqual(false);
    });
  });

  describe('move maca para dentro de um balde', () => {
    it('move uma maca', async () => {
      const mockMacaId = 1;
      const mockBaldeId = 1;

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Maca, 'update').mockResolvedValueOnce([1]);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      const result = await macaRepository.moveToBalde(mockMacaId, mockBaldeId);

      expect(result.moved).toEqual(1);
    });

    it('falha durante movimentacao da maca', async () => {
      const mockMacaId = 1;
      const mockBaldeId = 1;

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Maca, 'update').mockRejectedValueOnce(new Error('error'));

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      expect(() =>
        macaRepository.moveToBalde(mockMacaId, mockBaldeId)
      ).rejects.toThrow('Erro ao registrar relacao entre maca e balde');
    });
  });

  describe('move a maca pada fora de um balde', () => {
    it('move uma maca', async () => {
      const mockMacaId = 1;
      const mockBaldeId = 1;

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Maca, 'update').mockResolvedValueOnce([1]);

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      const result = await macaRepository.moveFromBalde(
        mockMacaId,
        mockBaldeId
      );

      expect(result.moved).toEqual(1);
    });

    it('falha durante movimentacao da maca', async () => {
      const mockMacaId = 1;
      const mockBaldeId = 1;

      const sequelize = new Sequelize();
      const mockTransaction = new Transaction(sequelize, {});
      jest
        .spyOn(sequelize, 'transaction')
        .mockResolvedValueOnce(mockTransaction);

      jest.spyOn(Maca, 'update').mockRejectedValueOnce(new Error('error'));

      jest.spyOn(sequelize, 'model').mockReturnValueOnce(Maca);

      const macaRepository = new MacaRepository(sequelize);

      expect(() =>
        macaRepository.moveFromBalde(mockMacaId, mockBaldeId)
      ).rejects.toThrow('Erro ao desfazer relacao entre maca e balde');
    });
  });
});
