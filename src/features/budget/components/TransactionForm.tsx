import { useMemo, useState } from "react";
import {
  Button,
  Group,
  NumberInput,
  Select,
  SegmentedControl,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { Category, Transaction, TxType } from "../types";

export default function TransactionForm({
  categories,
  onAdd,
  defaultCategoryId,
}: {
  categories: Category[];
  defaultCategoryId: string;
  onAdd: (tx: Omit<Transaction, "id">) => void;
}) {
  const [type, setType] = useState<TxType>("expense");
  const [date, setDate] = useState<Date | null>(new Date());
  const [categoryId, setCategoryId] = useState<string>(defaultCategoryId);
  const [amount, setAmount] = useState<number | string>("");
  const [note, setNote] = useState("");

  const options = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories]
  );

  function submit() {
    if (!date || !categoryId) return;
    const a =
      typeof amount === "number"
        ? amount
        : Number(String(amount).replace(",", "."));
    if (!Number.isFinite(a) || a <= 0) return;

    onAdd({
      date: dayjs(date).format("YYYY-MM-DD"),
      type,
      categoryId,
      amount: a,
      note: note.trim(),
    });

    setAmount("");
    setNote("");
  }

  const reasonLabel = type === "income" ? "Reason (income)" : "Reason (expense)";

  return (
    <Stack gap="sm">
      <Title order={5}>Add transaction</Title>

      <SegmentedControl
        value={type}
        onChange={(v) => setType(v as TxType)}
        data={[
          { value: "expense", label: "Expense" },
          { value: "income", label: "Income" },
        ]}
        fullWidth
      />

      <DateInput
        value={date}
        onChange={setDate}
        label="Date"
        valueFormat="YYYY-MM-DD"
        placeholder="YYYY-MM-DD"
        clearable={false}
      />

      <Select
        label="Category"
        data={options}
        value={categoryId}
        onChange={(v) => setCategoryId(v ?? "")}
        placeholder="Select category"
        searchable
      />

      <NumberInput
        label="Amount"
        value={typeof amount === "number" ? amount : undefined}
        onChange={(value) => setAmount(value ?? "")}
        min={0}
        decimalScale={2}
        thousandSeparator=" "
        placeholder="e.g. 49.99"
      />

      <TextInput
        label={reasonLabel}
        value={note}
        onChange={(e) => setNote(e.currentTarget.value)}
        placeholder={type === "income" ? "e.g. Salary, refund, bonus" : "e.g. groceries, taxi, rent"}
      />

      <Group justify="flex-end" mt="xs">
        <Button onClick={submit}>Add</Button>
      </Group>
    </Stack>
  );
}
