import { z } from 'zod';

const baldeSchema = z.object({
  id: z.number().min(1),
  capacidade: z.number(),
  nome: z.string().optional(),
});

const createBaldeDtoSchema = z.object({
  capacidade: z.number(),
  nome: z.string().optional(),
});

type Balde = z.infer<typeof baldeSchema>;
type CreateBaldeDto = z.infer<typeof createBaldeDtoSchema>;

export {
  baldeSchema,
  createBaldeDtoSchema,
  Balde,
  CreateBaldeDto,
};
