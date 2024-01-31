import { setInterval } from 'timers';

import { configs } from '../../utils/configs';
import { ServiceError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { MacaService } from '../maca/macaService';

type MacaWatched = {
  id: number;
  expiracao: Date;
};

class MacaEvictionService {
  watched: MacaWatched[];
  timer: NodeJS.Timeout | undefined;

  constructor(private readonly macaService: MacaService) {
    this.watched = [];
  }

  /**
   * Busca a lista de macas que nao estao vencidas e as adiciona em uma lista de monitoramento.
   * A lista de monitoramento e varrida a cada 1 segundos para encontrar macas vencidas e as
   * remover
   */
  async monitorarDataDeValidadeDeMaca(): Promise<void> {
    try {
      const macas = await this.getMacas();
      macas.forEach((maca: MacaWatched) => {
        this.adicionarMacaAListadeMonitoramentoDeValidade(maca);
      });

      logger.info('Lista de monitoramento criada. Iniciando monitoramento...');

      const timer = setInterval(async () => {
        const vencidas = this.verificarMacasElegiveisARemocao();

        const paraRemocao = vencidas.map(async (vencida) =>
          this.deleteMaca(vencida)
        );
        await Promise.all(paraRemocao);
      }, configs.MACA_EVICTION_INTERVAL_CHECK);

      this.setTimer(timer);
    } catch (error) {
      this.clearTimer();
      throw new ServiceError('Erro ao monitorar data de expiracao de macas', {
        cause: error as Error,
      });
    }
  }

  // eu sei que é um nome 'java'. desculpa.
  adicionarMacaAListadeMonitoramentoDeValidade(maca: MacaWatched): void {
    const index = this.watched.findIndex(
      (macaWatched: MacaWatched) => macaWatched.id === maca.id
    );

    // nao queremos verificar uma maca duas vezes
    if (index === -1) {
      this.watched.push(maca);
    }
  }

  removerMacaDaListadeMonitoramentoDeValidade(macaId: number): void {
    const index = this.watched.findIndex(
      (macaWatched: MacaWatched) => macaWatched.id === macaId
    );

    if (index === -1) {
      logger.warn(
        'Nao foi possivel remover maca da lista de monitoramento: Maca nao encontrada'
      );
      return;
    }

    this.watched.splice(index, 1);
    logger.info('Maca removida da lista de monitoramento');
  }

  private verificarMacasElegiveisARemocao(): number[] {
    const now = new Date();
    now.setMilliseconds(0);

    return (
      this.watched
        .map((maca: MacaWatched) => {
          const expiracao = maca.expiracao;
          expiracao.setMilliseconds(0);

          if (now.getTime() >= expiracao.getTime()) {
            // vencida
            return maca.id;
          }
          return;
        })
        // esse filter é um truque pra retornar somente valores validos da lista e remover
        // os 'undefined' que vao estar presentes caso a maca nao esteja vencida (ultimo return)
        .filter((a) => a) as number[]
    );
  }

  private async deleteMaca(macaId: number): Promise<void> {
    try {
      const result = await this.macaService.remove(macaId);

      if (result.removed === 0) {
        logger.warn(`Nao foi possivel remover maca expirada ${macaId}`);
        return;
      }

      this.removerMacaDaListadeMonitoramentoDeValidade(macaId);

      logger.info(`Maca ${macaId} expirou e foi removida`);
    } catch (error) {
      throw new ServiceError('Erro ao remover maca expirada', {
        cause: error as Error,
        details: { input: macaId },
      });
    }
  }

  private async getMacas(): Promise<MacaWatched[]> {
    try {
      const macas = await this.macaService.getMacasIdAndExpiration();

      return macas;
    } catch (error) {
      throw new ServiceError('Erro ao listar todas as macas', {
        cause: error as Error,
      });
    }
  }

  setTimer(timer: NodeJS.Timeout): void {
    this.timer = timer;
  }

  clearTimer(): void {
    clearTimeout(this.timer);
  }

  // usado para testes unitarios somente.
  getWatched(): MacaWatched[] {
    return this.watched;
  }
}

export { MacaEvictionService };
