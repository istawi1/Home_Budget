import { parse, unparse } from "papaparse";
import { BudgetState, Transaction, Category } from "./types";

type CsvRow = {
  date: string;
  type: "income" | "expense";
  category: string;
  amount: string;
  note: string;
};

export function exportCSV(state: BudgetState): string {
  const catById = new Map(state.categories.map((c) => [c.id, c.name]));
  const rows: CsvRow[] = state.transactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t) => ({
      date: t.date,
      type: t.type,
      category: catById.get(t.categoryId) ?? "",
      amount: String(t.amount),
      note: t.note ?? "",
    }));

  return unparse(rows, {
    quotes: false,
    delimiter: ",",
    newline: "\n",
  });
}

export function importCSV(csvText: string): {
  categories: Category[];
  transactions: (Omit<Transaction, "id" | "categoryId"> & { category: string })[];
} {
  const parsed = parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  const rawRows = (parsed.data ?? []) as CsvRow[];
  const rows = rawRows.filter(
    (r) => r.date && r.type && r.category && r.amount
  );

  const categories = Array.from(
    new Set(rows.map((r) => r.category.trim()).filter(Boolean))
  )
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ id: "", name }));

  const transactions = rows.map((r) => ({
    date: r.date.trim(),
    type: r.type,
    category: r.category.trim(),
    amount: Number(String(r.amount).replace(",", ".")),
    note: (r.note ?? "").trim(),
  }));

  return { categories, transactions };
}
