export type RemoveResult = {
  removed: number;
  message?: string;
};

export type MoveResult = {
  moved: number;
  message?: string;
};

export type BaldeListResultItem = {
  id: number;
  nome: string;
  capacidade: number;
  ocupacao: number;
  valorTotal: number;
};
