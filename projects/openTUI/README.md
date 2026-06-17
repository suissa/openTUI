# openTUI

`projects/openTUI` is an extracted copy of the terminal UI used by this repository. It keeps the same Solid/OpenTUI source structure as `packages/tui`, while adding a local `examples` folder with a component gallery and an extensive component usage guide.

## Layout

- `src/app.tsx` and `src/runtime.tsx`: application/runtime entrypoints.
- `src/routes`: screen-level route composition.
- `src/component`: domain-level TUI components and dialogs.
- `src/ui`: reusable UI primitives.
- `src/context`: providers for theme, keymap, SDK, route, prompt, runtime, and persistence.
- `src/plugin`: plugin route/runtime integration.
- `src/prompt`: prompt display, history, traits, stash, and frecency utilities.
- `src/util`: formatting, selection, scroll, renderer, transcript, and other helpers.
- `examples`: component gallery plus guidance on how and when to use each component.

## Development

Run commands from this package directory, not the repository root:

```bash
cd projects/openTUI
bun typecheck
bun test
```

The root workspace includes `projects/*` so this extracted package can resolve workspace and catalog dependencies consistently with the original package.

## Documentation

Start with [`examples/README.md`](./examples/README.md). It explains the component layers, documents every reusable primitive/application component, and provides recommendations for creating new components.
