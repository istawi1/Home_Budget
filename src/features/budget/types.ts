export type TxType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
};

export type Transaction = {
  id: string;
  date: string;
  type: TxType;
  categoryId: string;
  amount: number;
  note: string;
};

export type BudgetState = {
  categories: Category[];
  transactions: Transaction[];
};
