import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Grid,
  Group,
  Stack,
  Tabs,
  Button,
  Divider,
  Text,
  Modal,
  FileInput,
  Center,
  Loader,
  Skeleton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDownload, IconUpload, IconTrash, IconSettings } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

import { BudgetState, Category, Transaction } from "./types";
import { loadInitialState, saveState, clearState } from "./storage";
import { exportCSV, importCSV } from "./csv";
import { totals } from "./selectors";

import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionsTable from "./components/TransactionsTable";
import CategoriesManager from "./components/CategoriesManager";
import ChartsPanel from "./components/ChartsPanel";

function defaultState(): BudgetState {
  const cats: Category[] = [
    { id: uuid(), name: "Food" },
    { id: uuid(), name: "Transport" },
    { id: uuid(), name: "Bills" },
    { id: uuid(), name: "Entertainment" },
    { id: uuid(), name: "Health" },
    { id: uuid(), name: "Other" },
  ];
  return { categories: cats, transactions: [] };
}

function DashboardSkeleton() {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <div style={{ width: "55%" }}>
          <Skeleton height={20} width={120} radius="md" />
          <Skeleton height={12} mt={10} width="70%" radius="md" />
        </div>
        <Group>
          <Skeleton height={36} width={120} radius="md" />
          <Skeleton height={36} width={120} radius="md" />
          <Skeleton height={36} width={120} radius="md" />
        </Group>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="lg" p="md">
            <Skeleton height={12} width={80} radius="md" />
            <Skeleton height={26} mt={10} width="70%" radius="md" />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="lg" p="md">
            <Skeleton height={12} width={80} radius="md" />
            <Skeleton height={26} mt={10} width="70%" radius="md" />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="lg" p="md">
            <Skeleton height={12} width={80} radius="md" />
            <Skeleton height={26} mt={10} width="70%" radius="md" />
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder radius="lg" p="md">
            <Skeleton height={16} width={140} radius="md" />
            <Skeleton height={34} mt="md" radius="md" />
            <Skeleton height={34} mt="sm" radius="md" />
            <Skeleton height={34} mt="sm" radius="md" />
            <Skeleton height={34} mt="sm" radius="md" />
            <Skeleton height={34} mt="sm" radius="md" />
            <Group justify="flex-end" mt="md">
              <Skeleton height={36} width={90} radius="md" />
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder radius="lg" p="md">
            <Group justify="space-between" mb="md">
              <Skeleton height={28} width={280} radius="md" />
              <Loader size="sm" />
            </Group>
            <Skeleton height={420} radius="md" />
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default function BudgetPage() {
  const [state, setState] = useState<BudgetState>(defaultState());
  const [loading, setLoading] = useState(true);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importCsvFile, setImportCsvFile] = useState<File | null>(null);
  const [importJsonFile, setImportJsonFile] = useState<File | null>(null);

  useEffect(() => {
    const MIN_LOADING_MS = 1200;
    const startedAt = Date.now();

    (async () => {
      const initial = await loadInitialState(defaultState());
      setState(initial);

      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, MIN_LOADING_MS - elapsed);
      setTimeout(() => setLoading(false), wait);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) saveState(state);
  }, [state, loading]);

  const stats = useMemo(() => totals(state), [state]);

  function addTransaction(tx: Omit<Transaction, "id">) {
    setState((s) => ({ ...s, transactions: [{ ...tx, id: uuid() }, ...s.transactions] }));
    notifications.show({ message: "Transaction added", color: "green" });
  }

  function deleteTransaction(id: string) {
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
    notifications.show({ message: "Transaction deleted", color: "gray" });
  }

  function upsertCategory(cat: Category) {
    setState((s) => {
      const exists = s.categories.some((c) => c.id === cat.id);
      const categories = exists
        ? s.categories.map((c) => (c.id === cat.id ? cat : c))
        : [...s.categories, cat];
      return { ...s, categories };
    });
  }

  function deleteCategory(categoryId: string) {
    setState((s) => {
      const categories = s.categories.filter((c) => c.id !== categoryId);
      const fallback = categories[0]?.id ?? "";
      const transactions = s.transactions.map((t) =>
        t.categoryId === categoryId ? { ...t, categoryId: fallback } : t
      );
      return { categories, transactions };
    });
  }

  function downloadCsv() {
    const csv = exportCSV(state);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget_${dayjs().format("YYYY-MM-DD")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadJson() {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget_${dayjs().format("YYYY-MM-DD")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function doImportCsv() {
    if (!importCsvFile) return;

    const text = await importCsvFile.text();
    const parsed = importCSV(text);

    setState((s) => {
      const nameToId = new Map<string, string>(
        s.categories.map((c) => [c.name.toLowerCase(), c.id])
      );

      const newCategories: Category[] = [];
      for (const c of parsed.categories) {
        const key = c.name.toLowerCase();
        if (!nameToId.has(key)) {
          const id = uuid();
          nameToId.set(key, id);
          newCategories.push({ id, name: c.name });
        }
      }

      const importedTx: Transaction[] = parsed.transactions
        .filter((t) => Number.isFinite(t.amount) && t.amount >= 0 && t.date.length >= 7)
        .map((t) => {
          const cid = nameToId.get(t.category.toLowerCase()) ?? s.categories[0]?.id ?? "";
          return {
            id: uuid(),
            date: t.date,
            type: t.type,
            categoryId: cid,
            amount: t.amount,
            note: t.note,
          };
        });

      return {
        categories: [...s.categories, ...newCategories],
        transactions: [...importedTx, ...s.transactions],
      };
    });

    setImportCsvFile(null);
    setSettingsOpen(false);
    notifications.show({ message: "CSV imported", color: "green" });
  }

  async function doImportJson() {
    if (!importJsonFile) return;

    try {
      const text = await importJsonFile.text();
      const parsed = JSON.parse(text) as BudgetState;

      if (!parsed?.categories || !parsed?.transactions) {
        notifications.show({ message: "Invalid JSON format", color: "red" });
        return;
      }

      setState(parsed);
      setImportJsonFile(null);
      setSettingsOpen(false);
      notifications.show({ message: "JSON imported", color: "green" });
    } catch {
      notifications.show({ message: "Failed to read JSON", color: "red" });
    }
  }

  function resetAll() {
    clearState();
    setState(defaultState());
    notifications.show({ message: "Data reset", color: "gray" });
  }

  if (loading) return <DashboardSkeleton />;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text fw={700} size="lg">
            Dashboard
          </Text>
          <Text c="dimmed" size="sm">
            Made by istawi1, for you :D
          </Text>
        </div>

        <Group>
          <Button leftSection={<IconDownload size={16} />} variant="light" onClick={downloadCsv}>
            Export CSV
          </Button>
          <Button leftSection={<IconDownload size={16} />} variant="light" onClick={downloadJson}>
            Export JSON
          </Button>
          <Button leftSection={<IconSettings size={16} />} onClick={() => setSettingsOpen(true)}>
            Settings
          </Button>
        </Group>
      </Group>

      <SummaryCards income={stats.income} expense={stats.expense} balance={stats.balance} />

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder radius="lg" p="md">
            <TransactionForm
              categories={state.categories}
              onAdd={addTransaction}
              defaultCategoryId={state.categories[0]?.id ?? ""}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder radius="lg" p="md">
            <Tabs defaultValue="transactions">
              <Tabs.List>
                <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
                <Tabs.Tab value="charts">Charts</Tabs.Tab>
                <Tabs.Tab value="categories">Categories</Tabs.Tab>
              </Tabs.List>

              <Divider my="md" />

              <Tabs.Panel value="transactions">
                <TransactionsTable
                  categories={state.categories}
                  transactions={state.transactions}
                  onDelete={deleteTransaction}
                />
              </Tabs.Panel>

              <Tabs.Panel value="charts">
                <ChartsPanel state={state} />
              </Tabs.Panel>

              <Tabs.Panel value="categories">
                <CategoriesManager
                  categories={state.categories}
                  onUpsert={upsertCategory}
                  onDelete={deleteCategory}
                />
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid.Col>
      </Grid>

      <Modal opened={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings" radius="lg">
        <Stack>
          <Card withBorder radius="lg" p="md">
            <Group justify="space-between">
              <div>
                <Text fw={600}>Import CSV</Text>
                <Text size="sm" c="dimmed">
                  Columns: date,type,category,amount,note
                </Text>
              </div>
              <IconUpload size={18} />
            </Group>

            <Divider my="sm" />

            <FileInput
              value={importCsvFile}
              onChange={setImportCsvFile}
              accept=".csv,text/csv"
              placeholder="Select CSV file"
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={doImportCsv} disabled={!importCsvFile}>
                Import CSV
              </Button>
            </Group>
          </Card>

          <Card withBorder radius="lg" p="md">
            <Group justify="space-between">
              <div>
                <Text fw={600}>Import JSON</Text>
                <Text size="sm" c="dimmed">
                  categories + transactions
                </Text>
              </div>
              <IconUpload size={18} />
            </Group>

            <Divider my="sm" />

            <FileInput
              value={importJsonFile}
              onChange={setImportJsonFile}
              accept=".json,application/json"
              placeholder="Select JSON file"
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={doImportJson} disabled={!importJsonFile}>
                Import JSON
              </Button>
            </Group>
          </Card>

          <Card withBorder radius="lg" p="md">
            <Group justify="space-between">
              <div>
                <Text fw={600}>Reset data</Text>
                <Text size="sm" c="dimmed">
                  Clears localStorage and restores defaults
                </Text>
              </div>
              <IconTrash size={18} />
            </Group>

            <Divider my="sm" />

            <Button color="red" variant="light" onClick={resetAll} fullWidth>
              Reset
            </Button>
          </Card>
        </Stack>
      </Modal>
    </Stack>
  );
}
