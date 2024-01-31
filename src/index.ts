import { initDB, sequelize } from './models';
import { BaldeRepository } from './repos/balde';
import { MacaRepository } from './repos/maca';
import { startApi } from './rest-api';
import { BaldeService } from './services/balde';
import { MacaService } from './services/maca';
import { MacaEvictionService } from './services/maca-eviction';
import { logger } from './utils/logger';
import { Services } from './utils/types';

const baldeRepository = new BaldeRepository(sequelize);
const macaRepository = new MacaRepository(sequelize);

const macaService = new MacaService(macaRepository);
const baldeService = new BaldeService(baldeRepository, macaService);
const macaEvictionService = new MacaEvictionService(macaService);

(async () => {
  try {
    logger.info('Inicializando banco de dados');
    await initDB();

    const services: Services = {
      maca: macaService,
      balde: baldeService,
      monitoramento: macaEvictionService,
    };

    logger.info('Inicializando servico de monitoramento de macas vencidas');
    await macaEvictionService.monitorarDataDeValidadeDeMaca();

    logger.info('Inicializando api rest');
    startApi(services);
  } catch (error) {
    logger.error((error as Error).message);
    logger.error('Erro na execucao da aplicacao. Saindo...');
    process.exit(1);
  }
})();
