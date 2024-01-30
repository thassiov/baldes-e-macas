import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import { sequelize } from '../db';

const macaSchema = z.object({
  id: z.number().min(1),
  baldeId: z.number().min(1).optional(),
  nome: z.string().min(1),
  preco: z.number().nonnegative().multipleOf(0.01),
  expiracao: z.date(),
});

const createMacaDtoSchema = z.object({
  baldeId: z.number().min(1).optional(),
  nome: z.string().min(1),
  preco: z.number().nonnegative().multipleOf(0.01),
  expiracao: z.string().regex(/^\d+s$/),
  expiracaoDate: z.date().optional(),
});

type IMaca = z.infer<typeof macaSchema>;
type ICreateMacaDto = z.infer<typeof createMacaDtoSchema>;

class Maca extends Model {}
Maca.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expiracao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiracaoDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'maca',
    paranoid: true,
  }
);

export { macaSchema, createMacaDtoSchema, IMaca, ICreateMacaDto, Maca };
