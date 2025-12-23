import { useMemo } from "react";
import { Card, Grid, Group, Text } from "@mantine/core";
import { AreaChart, DonutChart } from "@mantine/charts";
import { BudgetState } from "../types";

const DONUT_COLORS = ["teal.6", "blue.6", "violet.6", "orange.6", "grape.6", "cyan.6"];

function formatEUR(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(v);
}

export default function ChartsPanel({ state }: { state: BudgetState }) {
  const catById = useMemo(() => new Map(state.categories.map((c) => [c.id, c.name])), [state]);

  const expenseByCat = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of state.transactions) {
      if (t.type !== "expense") continue;
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    }
    return Array.from(map.entries())
      .map(([id, value], index) => ({
        name: catById.get(id) ?? "—",
        value,
        color: DONUT_COLORS[index % DONUT_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [state, catById]);

  const monthly = useMemo(() => {
    const inc = new Map<string, number>();
    const exp = new Map<string, number>();

    for (const t of state.transactions) {
      const month = t.date.slice(0, 7); // YYYY-MM
      if (t.type === "income") inc.set(month, (inc.get(month) ?? 0) + t.amount);
      if (t.type === "expense") exp.set(month, (exp.get(month) ?? 0) + t.amount);
    }

    const months = Array.from(new Set([...inc.keys(), ...exp.keys()])).sort((a, b) =>
      a.localeCompare(b)
    );

    return months.map((m) => ({
      month: m,
      income: inc.get(m) ?? 0,
      expense: exp.get(m) ?? 0,
    }));
  }, [state]);

  const totalExpense = expenseByCat.reduce((s, x) => s + x.value, 0);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Card withBorder radius="lg" p="md">
          <Group justify="space-between" mb="xs">
            <Text fw={700}>Expenses by category</Text>
            <Text size="sm" c="dimmed">
              {formatEUR(totalExpense)}
            </Text>
          </Group>

          {expenseByCat.length === 0 ? (
            <Text c="dimmed" size="sm">
              No data for chart
            </Text>
          ) : (
            <DonutChart
              data={expenseByCat}
              withLabels
              withLabelsLine
              tooltipDataSource="segment"
              valueFormatter={(v) => formatEUR(v)}
              chartLabel="Expenses"
            />
          )}
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 7 }}>
        <Card withBorder radius="lg" p="md">
          <Group justify="space-between" mb="xs">
            <Text fw={700}>Monthly</Text>
            <Text size="sm" c="dimmed">
              Income vs expenses
            </Text>
          </Group>

          {monthly.length === 0 ? (
            <Text c="dimmed" size="sm">
              No data for chart
            </Text>
          ) : (
            <AreaChart
              h={320}
              data={monthly}
              dataKey="month"
              curveType="monotone"
              withLegend
              valueFormatter={(v) => formatEUR(Number(v))}
              series={[
                { name: "income", color: "teal.6" },
                { name: "expense", color: "red.6" },
              ]}
            />
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );
}
