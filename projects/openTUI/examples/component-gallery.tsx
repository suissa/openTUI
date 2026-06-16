import { createSignal, For, Show } from "solid-js"
import { TextAttributes } from "@opentui/core"
import { Spinner } from "../src/component/spinner"
import { Logo } from "../src/component/logo"
import { TodoItem } from "../src/component/todo-item"
import { WorkspaceLabel } from "../src/component/workspace-label"
import { ErrorComponent } from "../src/component/error-component"
import { DialogConfirm } from "../src/ui/dialog-confirm"
import { DialogPrompt } from "../src/ui/dialog-prompt"
import { DialogSelect, type DialogSelectOption } from "../src/ui/dialog-select"
import { DialogAlert } from "../src/ui/dialog-alert"
import { DialogHelp } from "../src/ui/dialog-help"
import { Link } from "../src/ui/link"
import { Toast } from "../src/ui/toast"

const modelOptions: DialogSelectOption<string>[] = [
  {
    title: "GPT-5.5",
    value: "gpt-5.5",
    category: "OpenAI",
    description: "Best for complex coding, research, and agentic workflows.",
    details: ["Use when reasoning quality matters more than latency."],
  },
  {
    title: "GPT-5.4 Mini",
    value: "gpt-5.4-mini",
    category: "OpenAI",
    description: "Fast and cost-efficient for smaller UI tasks.",
  },
]

export function ComponentGallery() {
  const [selectedModel, setSelectedModel] = createSignal("gpt-5.5")
  const [confirmed, setConfirmed] = createSignal(false)

  return (
    <box flexDirection="column" gap={1} padding={1}>
      <Logo />

      <box flexDirection="column" gap={1}>
        <text attributes={TextAttributes.BOLD}>Feedback components</text>
        <Spinner>Loading project data</Spinner>
        <Toast />
        <Link href="https://opentui.dev">Open OpenTUI documentation</Link>
      </box>

      <box flexDirection="column" gap={1}>
        <text attributes={TextAttributes.BOLD}>Stateful application components</text>
        <TodoItem content="Extract TUI package" status="completed" />
        <TodoItem content="Document components" status="in_progress" />
        <WorkspaceLabel type="local" name="Local workspace" status="connected" icon />
        <Show when={confirmed()}>
          <text>Destructive action confirmed.</text>
        </Show>
      </box>

      <box flexDirection="column" gap={1}>
        <text attributes={TextAttributes.BOLD}>Dialog bodies</text>
        <DialogAlert title="Heads up" message="Use alerts for important blocking information." />
        <DialogConfirm
          title="Delete session?"
          message="This cannot be undone."
          onConfirm={() => setConfirmed(true)}
        />
        <DialogPrompt title="Rename session" placeholder="New session name" onConfirm={() => {}} />
        <DialogSelect
          title="Choose model"
          current={selectedModel()}
          options={modelOptions}
          onSelect={(option) => setSelectedModel(option.value)}
        />
        <DialogHelp />
      </box>

      <box flexDirection="column" gap={1}>
        <text attributes={TextAttributes.BOLD}>Error state</text>
        <ErrorComponent error={new Error("Example render failure")} reset={() => {}} />
      </box>

      <box flexDirection="column" gap={1}>
        <text attributes={TextAttributes.BOLD}>Rendering lists</text>
        <For each={modelOptions}>{(option) => <text>{option.title}: {option.description}</text>}</For>
      </box>
    </box>
  )
}
