import {
  AppShell as MantineAppShell,
  Group,
  Title,
  Container,
  ActionIcon,
  Tooltip,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconBrandGithub, IconWallet, IconMoon, IconSun } from "@tabler/icons-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <MantineAppShell header={{ height: 64 }} padding="md">
      <MantineAppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Group gap="sm">
              <IconWallet size={22} />
              <div>
                <Title order={4}>Home Budget</Title>
                <Text size="xs" c="dimmed">
                  Transactions • Categories • Charts 
                </Text>
              </div>
            </Group>

            <Group>
              <Tooltip label="Toggle theme">
                <ActionIcon variant="subtle" onClick={() => toggleColorScheme()}>
                  {colorScheme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Profile on GitHub">
                <ActionIcon
                  component="a"
                  href="https://github.com/istawi1"
                  target="_blank"
                  rel="noreferrer"
                  variant="subtle"
                  aria-label="github"
                >
                  <IconBrandGithub size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Container>
      </MantineAppShell.Header>

      <MantineAppShell.Main>
        <Container size="lg">{children}</Container>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
