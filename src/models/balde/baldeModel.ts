import { DataTypes, Model } from 'sequelize';
import { z } from 'zod';

import { sequelize } from '../db';

const baldeSchema = z.object({
  id: z.number().min(1),
  capacidade: z.number(),
  nome: z.string().optional(),
});

const createBaldeDtoSchema = z.object({
  capacidade: z.number().min(0),
  nome: z.string().optional(),
});

type IBalde = z.infer<typeof baldeSchema>;
type ICreateBaldeDto = z.infer<typeof createBaldeDtoSchema>;

class Balde extends Model {}
Balde.init(
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
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'balde',
    paranoid: true,
  }
);

export { baldeSchema, createBaldeDtoSchema, IBalde, ICreateBaldeDto, Balde };
