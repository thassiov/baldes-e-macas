import { ICreateBaldeDto } from '../../models/balde';
import { BaldeRepository } from '../../repos/balde';
import { MacaService } from '../maca';
import { BaldeService } from './baldeService';

describe('balde service', () => {
  const mockRepo = {
    create: jest.fn(),
    remove: jest.fn(),
    ocupacaoECapacidade: jest.fn(),
    listBaldes: jest.fn(),
    moveToBalde: jest.fn(),
    moveFromBalde: jest.fn(),
  };

  const mockMacaService = {
    create: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
    moveToBalde: jest.fn(),
    moveFromBalde: jest.fn(),
  };

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

      (mockRepo.create as jest.Mock).mockResolvedValueOnce(1);

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.create(mockBalde);
      expect(mockRepo.create).toHaveBeenCalledWith(mockBalde);
      expect(result).toEqual(1);
    });
  });

  describe('remocao', () => {
    it('remove um balde existente', async () => {
      const mockBaldeId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockResolvedValueOnce({
        ocupacao: 0,
        capacidade: 1,
      });
      (mockRepo.remove as jest.Mock).mockResolvedValueOnce({ removed: 1 });

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.remove(1);

      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
      expect(mockRepo.remove).toHaveBeenCalledWith(mockBaldeId);
      expect(result.removed).toEqual(1);
    });

    it('falha ao tentar remover um balde inexistente', async () => {
      const mockBaldeId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockRejectedValueOnce(
        new Error('O balde nao existe')
      );

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.remove(mockBaldeId);
      expect(result.removed).toEqual(0);
      expect(result.message).toEqual('O balde nao existe');

      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
    });

    it('falha ao tentar remover um balde que nao esta vazio', async () => {
      const mockBaldeId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockResolvedValueOnce({
        ocupacao: 1,
        capacidade: 1,
      });

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.remove(1);

      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
      expect(result.removed).toEqual(0);
      expect(result.message).toEqual(
        'O balde nao esta vazio e por isso nao pode ser removido'
      );
    });
  });

  describe('mover conteudo para dentro do balde', () => {
    it('move uma maca para o balde', async () => {
      const mockBaldeId = 1;
      const mockMacaId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockResolvedValueOnce({
        ocupacao: 0,
        capacidade: 1,
      });

      (mockMacaService.exists as jest.Mock).mockResolvedValueOnce(true);
      (mockMacaService.moveToBalde as jest.Mock).mockResolvedValueOnce({
        moved: 1,
      });

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.moveToBalde(mockBaldeId, mockMacaId);

      expect(result.moved).toEqual(1);
      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
      expect(mockMacaService.exists).toHaveBeenCalledWith(mockMacaId);
      expect(mockMacaService.moveToBalde).toHaveBeenCalledWith(
        mockMacaId,
        mockBaldeId
      );
    });

    it('falha ao tentar mover uma maca que nao existe para o balde', async () => {
      const mockBaldeId = 1;
      const mockMacaId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockResolvedValueOnce({
        ocupacao: 0,
        capacidade: 1,
      });

      (mockMacaService.exists as jest.Mock).mockResolvedValueOnce(false);

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.moveToBalde(mockBaldeId, mockMacaId);

      expect(result.moved).toEqual(0);
      expect(result.message).toEqual('A maca nao existe');
      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
      expect(mockMacaService.exists).toHaveBeenCalledWith(mockMacaId);
      expect(mockMacaService.moveToBalde).not.toHaveBeenCalled();
    });

    it('falha ao tentar mover uma maca para um balde que nao existe', async () => {
      const mockBaldeId = 1;
      const mockMacaId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockRejectedValueOnce(
        new Error('O balde nao existe')
      );

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.moveToBalde(mockBaldeId, mockMacaId);
      expect(result.moved).toEqual(0);
      expect(result.message).toEqual('O balde nao existe');

      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
      expect(mockMacaService.exists).not.toHaveBeenCalled();
      expect(mockMacaService.moveToBalde).not.toHaveBeenCalled();
    });

    it('falha ao tentar mover uma maca para um balde que esta cheio', async () => {
      const mockBaldeId = 1;
      const mockMacaId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockResolvedValueOnce({
        ocupacao: 1,
        capacidade: 1,
      });

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.moveToBalde(mockBaldeId, mockMacaId);

      expect(result.moved).toEqual(0);
      expect(result.message).toEqual('O balde esta cheio');

      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
      expect(mockMacaService.exists).not.toHaveBeenCalled();
      expect(mockMacaService.moveToBalde).not.toHaveBeenCalled();
    });
  });

  describe('mover conteudo para fora do balde', () => {
    it('move uma maca para fora do balde', async () => {
      const mockBaldeId = 1;
      const mockMacaId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockResolvedValueOnce({
        ocupacao: 0,
        capacidade: 1,
      });

      (mockMacaService.exists as jest.Mock).mockResolvedValueOnce(true);
      (mockMacaService.moveFromBalde as jest.Mock).mockResolvedValueOnce({
        moved: 1,
      });

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.moveFromBalde(mockBaldeId, mockMacaId);

      expect(result.moved).toEqual(1);
      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
      expect(mockMacaService.exists).toHaveBeenCalledWith(mockMacaId);
      expect(mockMacaService.moveFromBalde).toHaveBeenCalledWith(
        mockMacaId,
        mockBaldeId
      );
    });

    it('falha ao tentar mover uma maca que nao existe para fora do balde', async () => {
      const mockBaldeId = 1;
      const mockMacaId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockResolvedValueOnce({
        ocupacao: 0,
        capacidade: 1,
      });

      (mockMacaService.exists as jest.Mock).mockResolvedValueOnce(false);

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.moveFromBalde(mockBaldeId, mockMacaId);

      expect(result.moved).toEqual(0);
      expect(result.message).toEqual('A maca nao existe');
      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
      expect(mockMacaService.exists).toHaveBeenCalledWith(mockMacaId);
      expect(mockMacaService.moveFromBalde).not.toHaveBeenCalled();
    });

    it('falha ao tentar mover uma maca para fora de um balde que nao existe', async () => {
      const mockBaldeId = 1;
      const mockMacaId = 1;

      (mockRepo.ocupacaoECapacidade as jest.Mock).mockRejectedValueOnce(
        new Error('O balde nao existe')
      );

      (mockMacaService.exists as jest.Mock).mockResolvedValueOnce(false);

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.moveFromBalde(mockBaldeId, mockMacaId);
      expect(result.moved).toEqual(0);
      expect(result.message).toEqual('O balde nao existe');
      expect(mockRepo.ocupacaoECapacidade).toHaveBeenCalledWith(mockBaldeId);
      expect(mockMacaService.exists).not.toHaveBeenCalled();
      expect(mockMacaService.moveFromBalde).not.toHaveBeenCalled();
    });
  });

  describe('listar baldes e seus conteudos', () => {
    it('retorna uma lista vazia quando nao ha baldes', async () => {
      (mockRepo.listBaldes as jest.Mock).mockResolvedValueOnce([]);

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.listBaldes();

      expect(result).toEqual([]);
      expect(mockRepo.listBaldes).toHaveBeenCalled();
    });

    it('retorna uma lista com 1 balde', async () => {
      const mockBalde = {
        id: 1,
        nome: 'A',
        capacidade: 1,
        ocupacao: 100,
        valorTotal: 1,
      };

      (mockRepo.listBaldes as jest.Mock).mockResolvedValueOnce([mockBalde]);

      const baldeService = new BaldeService(
        mockRepo as any as BaldeRepository,
        mockMacaService as any as MacaService
      );

      const result = await baldeService.listBaldes();

      expect(result).toEqual([mockBalde]);
      expect(mockRepo.listBaldes).toHaveBeenCalled();
    });
  });
});
