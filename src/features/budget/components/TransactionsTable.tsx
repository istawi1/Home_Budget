import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { Category, Transaction } from "../types";

function formatMoney(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(v);
}

export default function TransactionsTable({
  categories,
  transactions,
  onDelete,
}: {
  categories: Category[];
  transactions: Transaction[];
  onDelete: (id: string) => void;
}) {
  const [q, setQ] = useState("");

  const catById = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return transactions;
    return transactions.filter((t) => {
      const cat = (catById.get(t.categoryId) ?? "").toLowerCase();
      return (
        t.date.toLowerCase().includes(query) ||
        t.note.toLowerCase().includes(query) ||
        cat.includes(query) ||
        String(t.amount).includes(query) ||
        t.type.includes(query)
      );
    });
  }, [q, transactions, catById]);

  return (
    <>
      <TextInput
        leftSection={<IconSearch size={16} />}
        placeholder="Search by date, category, amount, reason..."
        value={q}
        onChange={(e) => setQ(e.currentTarget.value)}
        mb="md"
      />

      <ScrollArea h={420}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Reason</Table.Th>
              <Table.Th style={{ width: 60 }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>
                  <Text fw={600}>{t.date}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color={t.type === "income" ? "green" : "red"}>
                    {t.type === "income" ? "Income" : "Expense"}
                  </Badge>
                </Table.Td>
                <Table.Td>{catById.get(t.categoryId) ?? "—"}</Table.Td>
                <Table.Td>
                  <Text fw={700}>{formatMoney(t.amount)}</Text>
                </Table.Td>
                <Table.Td>{t.note || "—"}</Table.Td>
                <Table.Td>
                  <Group justify="flex-end">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      aria-label="delete"
                      onClick={() => onDelete(t.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
