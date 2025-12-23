import { BudgetState } from "./types";

const KEY = "budget_mantine_v1";

export function loadState(): BudgetState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BudgetState;
  } catch {
    return null;
  }
}

export async function loadInitialState(fallback: BudgetState): Promise<BudgetState> {
  const local = loadState();
  if (local) return local;

  try {
    const res = await fetch("/budget.json", { cache: "no-store" });
    if (!res.ok) return fallback;
    const json = (await res.json()) as BudgetState;
    return json ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveState(state: BudgetState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState() {
  localStorage.removeItem(KEY);
}
