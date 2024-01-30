import { initDB, sequelize } from './models';
import { BaldeRepository } from './repos/balde';
import { MacaRepository } from './repos/maca';
import { BaldeService } from './services/balde';
import { MacaService } from './services/maca';

const baldeRepository = new BaldeRepository(sequelize);
const macaRepository = new MacaRepository(sequelize);

const macaService = new MacaService(macaRepository);
const baldeService = new BaldeService(baldeRepository, macaService);

(async () => {
  if (process.env.NODE_ENV !== 'test') {
    await initDB();
  }

  baldeService;

  // passar services para os endpoints
})();
