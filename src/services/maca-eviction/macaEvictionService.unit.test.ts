import { setInterval } from 'timers/promises';

import { CreateResult, MacaService } from '../maca/macaService';
import { MacaEvictionService } from './macaEvictionService';

describe('MacaEviction service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const mockMacaService = {
    create: jest.fn(),
    remove: jest.fn(),
    getMacasIdAndExpiration: jest.fn(),
  };

  function mockExpiracaoEmXSegundos(segundos: number): Date {
    const expiracao = new Date(Date.now() + segundos * 1000);
    expiracao.setMilliseconds(0);
    return expiracao;
  }

  // esse teste tem um timeout te 12 segundos para poder executar todo o
  // processo corretamente com espaco de sobra (que deve durar cerca de 9 segundos)
  it('deve monitorar uma lista de macas', async () => {
    const mockMacaExpiracao = [
      {
        id: 1,
        expiracao: mockExpiracaoEmXSegundos(3),
      },
      {
        id: 2,
        expiracao: mockExpiracaoEmXSegundos(6),
      },
      {
        id: 3,
        expiracao: mockExpiracaoEmXSegundos(9),
      },
    ];

    (
      mockMacaService.getMacasIdAndExpiration as jest.Mock
    ).mockResolvedValueOnce(mockMacaExpiracao);

    (mockMacaService.remove as jest.Mock).mockResolvedValue({ removed: 1 });

    const macaEvictionService = new MacaEvictionService(
      mockMacaService as any as MacaService
    );

    await macaEvictionService.monitorarDataDeValidadeDeMaca();

    // como a funcionalidade de 'monitorarDataDeValidadeDeMaca' e um timer,
    // se faz necessario usar um timer para verificar a execucao.
    // O timer verifica a cada 300 milisegundos se a lista de macas sendo monitoradas
    // termina para assim fazer a verificacao do metodo 'remove' que de fato remove
    // as macas. Feito isso, o timer que esta sendo executado dentro do
    // macaEvictionService e finalizado e o timer da funcao de teste tambem
    // logo em seguida
    for await (const _ of setInterval(300)) {
      if (macaEvictionService.getWatched().length === 0) {
        expect(mockMacaService.remove).toHaveBeenNthCalledWith(
          1,
          mockMacaExpiracao[0]!.id
        );
        expect(mockMacaService.remove).toHaveBeenNthCalledWith(
          2,
          mockMacaExpiracao[1]!.id
        );
        expect(mockMacaService.remove).toHaveBeenNthCalledWith(
          3,
          mockMacaExpiracao[2]!.id
        );
        macaEvictionService.clearTimer();
        break;
      }
    }
  }, 12000);

  it('deve adicionar uma nova maca ao monitoramento', async () => {
    (mockMacaService.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      expiracao: new Date(),
    });

    const macaEvictionService = new MacaEvictionService(
      mockMacaService as any as MacaService
    );

    const maca = (await mockMacaService.create()) as CreateResult;

    macaEvictionService.adicionarMacaAListadeMonitoramentoDeValidade(maca);

    expect(macaEvictionService.getWatched()).toHaveLength(1);
  });

  it('deve remover uma maca do monitoramento', async () => {
    (mockMacaService.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      expiracao: new Date(),
    });

    const macaEvictionService = new MacaEvictionService(
      mockMacaService as any as MacaService
    );

    const maca = (await mockMacaService.create()) as CreateResult;

    macaEvictionService.adicionarMacaAListadeMonitoramentoDeValidade(maca);

    expect(macaEvictionService.getWatched()).toHaveLength(1);

    macaEvictionService.removerMacaDaListadeMonitoramentoDeValidade(maca.id);

    expect(macaEvictionService.getWatched()).toHaveLength(0);
  });
});
