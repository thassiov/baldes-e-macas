import { z } from 'zod';

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

type Maca = z.infer<typeof macaSchema>;
type CreateMacaDto = z.infer<typeof createMacaDtoSchema>;

export { macaSchema, createMacaDtoSchema, Maca, CreateMacaDto };
