import { ICreateBaldeDto } from '../../models/balde';
import { BaldeRepository } from '../../repos/balde';
import { BaldeService } from './baldeService';

describe('balde service', () => {
  const mockRepo = {
    create: jest.fn(),
    remove: jest.fn(),
    isEmpty: jest.fn(),
    getAll: jest.fn(),
  } as BaldeRepository;

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('cria um novo balde', async () => {
    const mockBalde = {
      capacidade: 1,
      nome: 'balde A',
    } as ICreateBaldeDto;

    (mockRepo.create as jest.Mock).mockResolvedValueOnce(1);

    const baldeService = new BaldeService(mockRepo);

    const result = await baldeService.create(mockBalde);
    expect(mockRepo.create).toHaveBeenCalledWith(mockBalde);
    expect(result).toEqual(1);
  });

  it('remove um balde existente', async () => {
    const mockBaldeId = 1;

    (mockRepo.isEmpty as jest.Mock).mockResolvedValueOnce(true);
    (mockRepo.remove as jest.Mock).mockResolvedValueOnce({ removed: 1 });

    const baldeService = new BaldeService(mockRepo);

    const result = await baldeService.remove(1);

    expect(mockRepo.isEmpty).toHaveBeenCalledWith(mockBaldeId);
    expect(mockRepo.remove).toHaveBeenCalledWith(mockBaldeId);
    expect(result.removed).toEqual(1);
  });

  it('falha ao tentar remover um balde inexistente', async () => {
    const mockBaldeId = 1;

    (mockRepo.isEmpty as jest.Mock).mockRejectedValueOnce(
      new Error('O balde nao existe')
    );

    const baldeService = new BaldeService(mockRepo);

    expect(() => baldeService.remove(mockBaldeId)).rejects.toThrow(
      'O balde nao existe'
    );

    expect(mockRepo.isEmpty).toHaveBeenCalledWith(mockBaldeId);
  });

  it('falha ao tentar remover um balde que nao esta vazio', async () => {
    const mockBaldeId = 1;

    (mockRepo.isEmpty as jest.Mock).mockResolvedValueOnce(false);

    const baldeService = new BaldeService(mockRepo);

    const result = await baldeService.remove(1);

    expect(mockRepo.isEmpty).toHaveBeenCalledWith(mockBaldeId);
    expect(result.removed).toEqual(0);
    expect(result.message).toEqual(
      'O balde nao esta vazio e por isso nao pode ser removido'
    );
  });
});
