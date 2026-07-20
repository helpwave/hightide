# @helpwave/hightide-utils

Platform-agnostic utilities, React hooks, i18n helpers, and shared context primitives used by helpwave's hightide packages.

## Install

```bash
pnpm add @helpwave/hightide-utils
```

Peer dependency: `react` `^19`.

## Usage

There is **no package root export**. Import from folder entry points:

```ts
import { ArrayUtil, DateUtils } from "@helpwave/hightide-utils/utils";
import { useDebouncer } from "@helpwave/hightide-utils/hooks";
import { hightideTranslation } from "@helpwave/hightide-utils/i18n";
```

| Subpath | Contents |
| --- | --- |
| `@helpwave/hightide-utils/utils` | Utility modules (`ArrayUtil`, `DateUtils`, …) |
| `@helpwave/hightide-utils/hooks` | Shared React hooks |
| `@helpwave/hightide-utils/i18n` | Typed translations and i18n helpers |
| `@helpwave/hightide-utils/context` | Shared context barrel |
| `@helpwave/hightide-utils/context/localization` | Localization context |
| `@helpwave/hightide-utils/context/translation` | Translation context |
| `@helpwave/hightide-utils/context/theme` | Theme context |

Prefer Utils-object imports (for example `ArrayUtil.range`) over legacy standalone exports.

## Development

From the monorepo root:

```bash
pnpm --filter @helpwave/hightide-utils run init
pnpm --filter @helpwave/hightide-utils run build-intl
pnpm --filter @helpwave/hightide-utils run barrel
```
