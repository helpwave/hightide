# Import conventions

Applies to all packages in this monorepo (`hightide`, `hightide-native`, `hightide-design`, `hightide-utils`).

## Absolute package imports

Imports from **within the same package** must use the `@/` path alias (absolute from the package root), never relative paths such as `../` or `./`.

```ts
// Prefer
import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type { ChatTheme } from '@/src/theme/types/components/chat'

// Avoid
import { useTheme } from '../../global-contexts/theme'
import type { ChatTheme } from '../types/components/chat'
```

`@/*` maps to the package root (see each package's `tsconfig.json` `paths`). Prefer paths under `@/src/…` for source modules.

Cross-package imports (for example `@helpwave/hightide-design/tokens` or `@helpwave/hightide-utils/hooks`) keep their published package names. Do not rewrite those to `@/`.

## No index / barrel imports

Local package imports must target the **concrete module file**, never a folder `index` barrel.

```ts
// Prefer
import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type { StyleOverwrite } from '@/src/theme/types/resolver'
import { Button } from '@/src/components/user-interaction/Button'

// Avoid
import { useTheme } from '@/src/global-contexts/theme'
import type { StyleOverwrite } from '@/src/theme'
import { Button } from '@/src/components/user-interaction'
```

Barrel `index.ts` files may still exist for package **public** entrypoints. Do not import through them from other files inside this package.

## Bundle imports from the same module

Imports from the **same module** must be combined into a single import statement. Do not split value and type imports across multiple statements for one path.

When an import has more than one binding, write each binding on its own line:

```ts
import {
  ScrollView,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'
```

Single-binding imports may stay on one line:

```ts
import { useMemo } from 'react'
```

## Import order by externality

Group and order imports from most external to most local:

1. **External dependencies** — `react`, `react-native`, third-party libraries, Node built-ins
2. **Workspace / sibling packages** — `@helpwave/…` (and other monorepo packages)
3. **Internal package imports** — `@/…`

Separate groups with a blank line. Within a group, keep a stable alphabetical order when practical.

```ts
import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Text,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { Check } from 'lucide-react-native'

import { hexWithAlpha } from '@helpwave/hightide-design/helpers'
import { fontWeights } from '@helpwave/hightide-design/tokens'

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type { ChatTheme } from '@/src/theme/types/components/chat'
```
