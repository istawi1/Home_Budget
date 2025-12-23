import { useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";
import { Category } from "../types";

export default function CategoriesManager({
  categories,
  onUpsert,
  onDelete,
}: {
  categories: Category[];
  onUpsert: (cat: Category) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");

  const sorted = useMemo(
    () => categories.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  function startAdd() {
    setEditing(null);
    setName("");
    setOpen(true);
  }

  function startEdit(c: Category) {
    setEditing(c);
    setName(c.name);
    setOpen(true);
  }

  function save() {
    const n = name.trim();
    if (!n) return;
    if (editing) onUpsert({ ...editing, name: n });
    else onUpsert({ id: uuid(), name: n });
    setOpen(false);
  }

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={5}>Categories</Title>
        <Button leftSection={<IconPlus size={16} />} variant="light" onClick={startAdd}>
          Add
        </Button>
      </Group>

      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th style={{ width: 120 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sorted.map((c) => (
            <Table.Tr key={c.id}>
              <Table.Td>
                <Text fw={600}>{c.name}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs" justify="flex-end">
                  <ActionIcon variant="subtle" aria-label="edit" onClick={() => startEdit(c)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    aria-label="delete"
                    onClick={() => onDelete(c.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={open} onClose={() => setOpen(false)} title={editing ? "Edit category" : "New category"} radius="lg">
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="e.g. Home"
        />
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{editing ? "Save" : "Add"}</Button>
        </Group>
      </Modal>
    </>
  );
}
