import { initDB, sequelize } from './models';
import { BaldeRepository } from './repos/balde';
import { MacaRepository } from './repos/maca';
import { startApi } from './rest-api';
import { BaldeService } from './services/balde';
import { MacaService } from './services/maca';
import { logger } from './utils/logger';
import { Services } from './utils/types';

const baldeRepository = new BaldeRepository(sequelize);
const macaRepository = new MacaRepository(sequelize);

const macaService = new MacaService(macaRepository);
const baldeService = new BaldeService(baldeRepository, macaService);

(async () => {
  try {
    logger.info('Inicializando banco de dados');
    await initDB();
  } catch (error) {
    logger.error((error as Error).message);
    logger.error('Nao foi possivel inicializar o banco de dados');
    process.exit(1);
  }

  const services: Services = {
    maca: macaService,
    balde: baldeService,
  };

  logger.info('Inicializando api rest');
  startApi(services);
})();
