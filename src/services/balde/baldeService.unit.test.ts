import { CreateBaldeDto } from '../../models/balde';
import { BaldeRepository } from '../../repos/balde';
import { BaldeService } from './baldeService';

describe('balde service', () => {
  const mockRepo = {
    create: jest.fn(),
    remove: jest.fn(),
  } as BaldeRepository;

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('cria um novo balde', async () => {
    const mockBalde = {
      capacidade: 1,
      nome: 'balde A',
    } as CreateBaldeDto;

    (mockRepo.create as jest.Mock).mockResolvedValueOnce(1);

    const baldeService = new BaldeService(mockRepo);

    const result = await baldeService.create(mockBalde);
    expect(mockRepo.create).toHaveBeenCalledWith(mockBalde);
    expect(result).toEqual(1);
  });

  it('remove um balde existente', async () => {
    const mockBaldeId = 1;

    (mockRepo.remove as jest.Mock).mockResolvedValueOnce(true);

    const baldeService = new BaldeService(mockRepo);

    const result = await baldeService.remove(1);

    expect(mockRepo.remove).toHaveBeenCalledWith(mockBaldeId);
    expect(result).toEqual(true);
  });
});
