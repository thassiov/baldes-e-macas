import { ICreateMacaDto } from '../../models/maca';
import { MacaRepository } from '../../repos/maca';
import { MacaService } from './macaService';

function isDateXSecondsFromNow(date: Date, seconds: number): boolean {
  const now = new Date(Date.now() + seconds * 1000);
  now.setMilliseconds(0);
  date.setMilliseconds(0);

  return now.getTime() === date.getTime();
}

describe('maca service', () => {
  const mockRepo = {
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

  it('cria uma nova maca', async () => {
    const mockMaca = {
      preco: 1.5,
      nome: 'maca',
      expiracao: '10s',
    } as ICreateMacaDto;

    (mockRepo.create as jest.Mock).mockResolvedValueOnce(1);

    const macaService = new MacaService(mockRepo as any as MacaRepository);

    const result = await macaService.create(mockMaca);
    expect(mockRepo.create).toHaveBeenCalledWith({
      ...mockMaca,
    });

    expect(result.id).toEqual(1);
    expect(result.expiracao).toBeDefined();
    const seg = parseInt(mockMaca.expiracao.slice(0, -1));
    expect(isDateXSecondsFromNow(result.expiracao, seg)).toEqual(true);
  });

  it('falha ao tentar criar uma nova maca com expiracao 0 segundos', async () => {
    const mockMaca = {
      baldeId: 1,
      preco: 1.5,
      nome: 'maca',
      expiracao: '0s',
    } as ICreateMacaDto;

    const macaService = new MacaService(mockRepo as any as MacaRepository);

    expect(() => macaService.create(mockMaca)).rejects.toThrow(
      'A expiracao deve ser maior que 0 segundos'
    );
  });

  it('falha ao tentar criar uma nova maca com expiracao menor que 0 segundos', async () => {
    const mockMaca = {
      baldeId: 1,
      preco: 1.5,
      nome: 'maca',
      expiracao: '-4s',
    } as ICreateMacaDto;

    (mockRepo.create as jest.Mock).mockResolvedValueOnce(1);

    const macaService = new MacaService(mockRepo as any as MacaRepository);

    expect(() => macaService.create(mockMaca)).rejects.toThrow(
      'A expiracao deve ser maior que 0 segundos'
    );
  });

  it('remove uma maca existente', async () => {
    const mockMacaId = 1;

    (mockRepo.remove as jest.Mock).mockResolvedValueOnce({ removed: 1 });

    const macaService = new MacaService(mockRepo as any as MacaRepository);

    const result = await macaService.remove(mockMacaId);

    expect(mockRepo.remove).toHaveBeenCalledWith(1);
    expect(result.removed).toEqual(1);
  });

  it('falha ao tentar remover uma maca inexistente', async () => {
    const mockMacaId = 1;

    (mockRepo.remove as jest.Mock).mockRejectedValueOnce(
      new Error('A maca nao existe')
    );

    const macaService = new MacaService(mockRepo as any as MacaRepository);

    expect(() => macaService.remove(mockMacaId)).rejects.toThrow(
      'A maca nao existe'
    );
    expect(mockRepo.remove).toHaveBeenCalledWith(1);
  });
});
