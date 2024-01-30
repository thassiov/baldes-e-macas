import { Sequelize } from 'sequelize';

import { configs } from '../utils/configs';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: configs.DBFILE,
});

export { sequelize };
