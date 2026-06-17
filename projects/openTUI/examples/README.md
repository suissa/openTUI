# openTUI examples and component guide

This folder documents the extracted TUI package that lives in `projects/openTUI`. The source is copied from `packages/tui` so it can be studied, reused, or evolved independently from the rest of the application.

## How the TUI is built

The project is a Solid JSX terminal application on top of OpenTUI:

- `@opentui/core` provides renderables such as `box`, `text`, `input`, colors, borders, and keyboard/mouse events.
- `@opentui/solid` provides the Solid renderer and JSX runtime for terminal components.
- `solid-js` supplies reactivity (`createSignal`, `createMemo`, `createEffect`, `Show`, `For`).
- `src/context/*` wires runtime services such as theme, route, SDK client, prompt state, key bindings, and persistent key-value state.
- `src/ui/*` contains reusable primitives such as dialogs, links, borders, spinners, and toasts.
- `src/component/*` contains application-level components composed from the primitives and contexts.
- `src/routes/*` contains screens that assemble components into the final application.

## Running the examples

The gallery in `component-gallery.tsx` is intentionally written as copyable Solid/OpenTUI code. It demonstrates the shape of each component and where it should be mounted. Most application components require the providers from `src/runtime.tsx` or `src/app.tsx`, because they depend on theme, keymap, SDK, route, prompt, and dialog contexts.

```bash
cd projects/openTUI
bun install
bun typecheck
```

Use the examples as a reference while integrating components into an OpenTUI Solid app. Dialog examples should be rendered inside the dialog host created by `src/ui/dialog.tsx`; screen-level examples should be rendered under the runtime providers.

## Component selection guide

### Core layout and feedback primitives

#### `Spinner` (`src/component/spinner.tsx`)

Use `Spinner` when an action is actively running and the user should wait without choosing anything. It reads `animations_enabled` from KV state and falls back to a static ellipsis when animations are disabled. Create it by placing `<Spinner>Loading...</Spinner>` inside a row or status area. Prefer it for network calls, startup work, and long-running commands.

#### `src/ui/spinner.ts`

Use this lower-level spinner helper when you need spinner frames or non-JSX rendering logic instead of the Solid `Spinner` component. Prefer the JSX `Spinner` for normal UI.

#### `Toast` (`src/ui/toast.tsx`)

Use toasts for short, non-blocking feedback such as "Copied", "Saved", or "Disconnected". They should not ask for a decision. Create a toast through the toast context/helper and keep messages concise.

#### `Link` (`src/ui/link.tsx`)

Use `Link` for URLs and actionable external references. It should be visually distinct from static text and should be used when clicking or activating opens external documentation, browser pages, or local resources.

#### `Border` (`src/ui/border.ts`)

Use border helpers when a component needs a consistent frame or divider. Prefer shared border constants over ad-hoc glyphs so the TUI keeps a consistent visual language.

#### `BgPulse` and `BgPulseRender` (`src/component/bg-pulse.tsx`, `src/component/bg-pulse-render.ts`)

Use for transient emphasis behind a row or area, for example when a new message arrives or a state changes. Avoid it for permanent selection state; selection should use theme colors.

### Dialog primitives

Dialogs are modal overlays. Use them when the user must make a choice, enter a value, or inspect focused information before continuing.

#### `Dialog` host (`src/ui/dialog.tsx`)

Use the dialog host/context to mount, replace, and clear modal content. App-level code should call dialog helpers rather than rendering modal boxes directly, because the host owns focus, escape behavior, and replacement.

#### `DialogAlert` (`src/ui/dialog-alert.tsx`)

Use for a blocking message with a single acknowledgment. It is best for errors or important information that must be noticed. Do not use it for confirmations; use `DialogConfirm` instead.

#### `DialogConfirm` (`src/ui/dialog-confirm.tsx`)

Use when an operation needs a yes/no decision, such as deleting, moving, or overwriting. Provide a clear title, a consequence-focused message, and optional label for the cancel action. Keep destructive operations behind this dialog.

#### `DialogPrompt` (`src/ui/dialog-prompt.tsx`)

Use when the user must type a short free-form value, such as a new name or command argument. Validate before accepting when possible and prefer specialized dialogs when the value has structured choices.

#### `DialogSelect` (`src/ui/dialog-select.tsx`)

Use for searchable lists, command palettes, model pickers, session lists, provider lists, and any selection with more than a few options. Provide categories, details, and disabled states when helpful. Use `current` to preselect the active value and actions/footer hints for secondary shortcuts.

#### `DialogExportOptions` (`src/ui/dialog-export-options.tsx`)

Use for choosing export formats or destinations. It is a specialized selection dialog for export workflows and should be preferred over a generic prompt for exports.

#### `DialogHelp` (`src/ui/dialog-help.tsx`)

Use for keyboard help, command summaries, or contextual support. It should be accessible from a help keybinding and should not mutate state.

### Application dialogs

Application dialogs wrap the primitives with domain-specific data and behavior. Use them when the scenario matches the name instead of recreating a generic select.

- `CommandPalette`: quick command discovery and execution. Use for global actions and keyboard-first navigation.
- `DialogAgent`: choose or inspect an agent. Use when a prompt/session needs an agent-specific mode.
- `DialogConsoleOrg`: choose a console organization. Use during account or organization switching.
- `DialogMcp`: manage or select MCP-related entries. Use for tool/server configuration flows.
- `DialogModel`: select a model. Use wherever model choice affects subsequent LLM calls.
- `DialogMoveSession`: move a session to another workspace/location. Use when preserving history while changing placement.
- `DialogProvider`: choose a provider. Use before model selection or provider-specific configuration.
- `DialogRetryAction`: choose what to do after a failed action. Use when retry, edit, or cancel are all valid.
- `DialogSessionDeleteFailed`: explain a failed delete. Use only for delete failure recovery.
- `DialogSessionList`: browse and switch sessions. Use for session navigation instead of a raw list.
- `DialogSessionRename`: rename a session. Use instead of a generic prompt so labels and side effects remain consistent.
- `DialogSkill`: choose a skill. Use when the user can augment the prompt with a skill.
- `DialogStash`: inspect or restore stashed prompt/history content. Use for prompt recovery workflows.
- `DialogStatus`: show detailed runtime/session status. Use for diagnostics and health checks.
- `DialogTag`: choose or edit tags. Use for classification, filtering, or metadata.
- `DialogThemeList`: choose a visual theme. Use from settings/preferences or command palette.
- `DialogVariant`: choose a model/provider variant. Use when a base model has multiple variants.
- `DialogWorkspaceCreate`: create a workspace. Use when the user needs a new location/container for sessions.
- `DialogWorkspaceFileChanges`: review changed files in a workspace. Use before switching, moving, or confirming file-sensitive actions.
- `DialogWorkspaceList`: choose a workspace. Use for workspace navigation.
- `DialogWorkspaceUnavailable`: explain why a workspace cannot be used. Use for recovery and diagnostics.

### Non-dialog application components

#### `ErrorComponent`

Use to render caught route/component errors in a terminal-friendly way. Include actionable recovery where possible.

#### `Logo`

Use for startup, empty states, and branding. Avoid repeating it in dense interactive screens.

#### `PluginRouteMissing`

Use when a plugin route cannot be resolved. It should guide users back to a safe route or explain which plugin path failed.

#### `StartupLoading`

Use during initialization before the complete runtime is ready. Keep it lightweight because startup paths are latency-sensitive.

#### `TodoItem`

Use to show a single todo/checklist item with state. Prefer it inside lists that track planned, running, and completed work.

#### `UseConnected`

Use as a render helper for connection-aware UI. It is useful for disabling or changing labels when the backend/session is disconnected.

#### `WorkspaceLabel`

Use wherever a workspace identity appears in compact UI. It centralizes formatting so workspace names, unavailable states, and metadata remain consistent.

## When to create new components

Create a new component when:

1. The same visual/interactive pattern appears in more than one place.
2. The component owns a meaningful boundary such as focus, selection, keyboard bindings, or async state.
3. The name describes a product concept, not just a temporary layout fragment.

Keep JSX inline when it is a one-off arrangement of `box` and `text`. Avoid extracting single-use helpers unless the helper names a real domain concept or hides complex rendering.

## Recommended component recipe

1. Start with a narrow scenario and decide whether it is a primitive (`src/ui`) or domain component (`src/component`).
2. Pull theme values from `useTheme()` instead of hard-coded colors.
3. Register keyboard behavior through the keymap/bindings utilities instead of handling keys ad hoc.
4. Use Solid signals/memos for local UI state.
5. Keep props explicit and avoid `any`; exported generic props are fine for reusable selectors.
6. Use `DialogSelect` for searchable choices and `DialogConfirm` for destructive confirmation.
7. Add the component to this guide and create a minimal example when adding a new public component.

### Prompt components

Prompt components live under `src/component/prompt` and should be used inside the prompt composer rather than as independent screens.

- `Prompt`/`PromptInput` (`index.tsx`): the main composer. Use when collecting user instructions and attachments.
- `Autocomplete`: inline completions for slash commands, file references, symbols, or other prompt tokens.
- `Cwd`: displays or resolves the current working directory context for the prompt.
- `Frecency`: ranks frequently and recently used prompt candidates. Use for command/file suggestions.
- `History`: navigates previous prompt entries. Use for keyboard recall and prompt reuse.
- `LocalAttachment`: converts local files into prompt attachments. Use when adding filesystem context.
- `Move`: prompt cursor/movement helpers. Use inside composer key handling.
- `Stash`: temporary prompt storage. Use when a draft must survive route changes or interrupted workflows.
- `Workspace`: workspace-aware prompt context. Use when prompt behavior depends on the active workspace.

### Feature plugin components

Feature plugin UI lives under `src/feature-plugins`. These components are extension points used by the runtime/plugin layer:

- `builtins.ts`: registers built-in feature plugin contributions.
- `home/footer.tsx`: home-screen footer contribution.
- `home/tips.tsx` and `home/tips-view.tsx`: tip content and rendering for empty/start states.
- `sidebar/context.tsx`: sidebar context provider/contribution point.

Use these when adding plugin-visible UI surfaces. Keep plugin boundaries explicit so built-in UI and third-party plugin UI follow the same slot model.
