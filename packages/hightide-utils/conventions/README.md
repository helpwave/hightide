# hightide-utils conventions

## Utils object exports

Every utility module groups its public functions and classes in a single object export:

```ts
export const ExampleUtils = {
  doSomething,
  doSomethingElse,
}
```

### Naming

Use a descriptive domain prefix with a `Utils` or `Util` suffix:

- `ArrayUtil`
- `DateUtils`
- `SimpleSearchUtils`

Existing names are kept for backward compatibility. New modules should follow the same pattern.

### What belongs in the Utils object

Include every **public** exported function or class from the module.

Do **not** include:

- Private helpers (`const` / `function` not exported)
- Module-internal constants used only inside the file
- Type-only exports (these stay as named `export type`)

If a private helper is already exposed through an existing Utils object (for example `ArrayUtil.moveItems`), keep it only on that object.

### Backward compatibility

Standalone exports remain available but are marked deprecated:

```ts
/** @deprecated Use ExampleUtils.doSomething instead. */
export { doSomething }
```

Prefer importing from the Utils object in new code:

```ts
import { ExampleUtils } from '@helpwave/hightide-utils/utils'

ExampleUtils.doSomething()
```

### Type exports

Type-only modules (for example `typing.ts`) export types directly and do not need a Utils object.

### Folder exports

Each published folder has an explicit `index.ts` that re-exports its public modules. The package root does not publish an `index.ts` export — consumers must import from folder paths such as `@helpwave/hightide-utils/utils`. After adding or renaming files, update the matching `index.ts`.
