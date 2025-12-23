import { Card, Grid, Group, Text } from "@mantine/core";
import { IconArrowDownRight, IconArrowUpRight, IconScale } from "@tabler/icons-react";

function formatMoney(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(v);
}

export default function SummaryCards({
  income,
  expense,
  balance,
}: {
  income: number;
  expense: number;
  balance: number;
}) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder radius="lg" p="md">
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm">
                Income
              </Text>
              <Text fw={800} size="xl">
                {formatMoney(income)}
              </Text>
            </div>
            <IconArrowUpRight size={22} />
          </Group>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder radius="lg" p="md">
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm">
                Expenses
              </Text>
              <Text fw={800} size="xl">
                {formatMoney(expense)}
              </Text>
            </div>
            <IconArrowDownRight size={22} />
          </Group>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder radius="lg" p="md">
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm">
                Balance
              </Text>
              <Text fw={800} size="xl">
                {formatMoney(balance)}
              </Text>
            </div>
            <IconScale size={22} />
          </Group>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
