import { BudgetState } from "./types";

export function totals(state: BudgetState) {
  const income = state.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expense = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
}

export function sumByCategory(state: BudgetState, type: "income" | "expense") {
  const map = new Map<string, number>();
  for (const t of state.transactions) {
    if (t.type !== type) continue;
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
  }
  return map;
}

export function sumByMonth(state: BudgetState, type: "income" | "expense") {
  const map = new Map<string, number>();
  for (const t of state.transactions) {
    if (t.type !== type) continue;
    const month = t.date.slice(0, 7);
    map.set(month, (map.get(month) ?? 0) + t.amount);
  }
  const months = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
  return months.map((m) => ({ month: m, value: map.get(m) ?? 0 }));
}
