import { DatabaseInstanceError } from '../utils/errors';
import {
  Balde,
  IBalde,
  ICreateBaldeDto,
  baldeSchema,
  createBaldeDtoSchema,
} from './balde';
import { sequelize } from './db';
import {
  ICreateMacaDto,
  IMaca,
  Maca,
  createMacaDtoSchema,
  macaSchema,
} from './maca';

Balde.hasMany(Maca);
Maca.belongsTo(Balde);

async function initDB(): Promise<void> {
  try {
    await sequelize.sync();
  } catch (error) {
    throw new DatabaseInstanceError('Erro ao inicializar o banco de dados', {
      cause: error as Error,
    });
  }
}

export {
  sequelize,
  initDB,
  baldeSchema,
  createBaldeDtoSchema,
  IBalde,
  ICreateBaldeDto,
  Balde,
  macaSchema,
  createMacaDtoSchema,
  IMaca,
  ICreateMacaDto,
  Maca,
};
