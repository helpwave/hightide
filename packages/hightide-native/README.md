# @helpwave/hightide-native

React Native components, theme resolvers, and providers for helpwave apps.

## Install

```bash
pnpm add @helpwave/hightide-native
```

Peer dependencies (install in your app if not already present):

```bash
pnpm add react react-native react-native-svg @react-native-async-storage/async-storage
```

## Setup

Wrap your app with `HightideProvider`:

```tsx
import { HightideProvider } from "@helpwave/hightide-native/global-contexts";

<HightideProvider theme={{ theme: "system" }} locale={{ locale: "system" }}>
  {children}
</HightideProvider>;
```

## Usage

Import from the package subpaths (there is no root export):

```tsx
import { Button, Input, Select } from "@helpwave/hightide-native/components";
import { HightideProvider } from "@helpwave/hightide-native/global-contexts";
import { useSelect } from "@helpwave/hightide-native/hooks";
import { Icon } from "@helpwave/hightide-native/icons";
```

| Subpath | Contents |
| --- | --- |
| `@helpwave/hightide-native/components` | UI components (`Button`, `Checkbox`, `Chip`, `Input`, …) |
| `@helpwave/hightide-native/global-contexts` | `HightideProvider` and related context providers |
| `@helpwave/hightide-native/hooks` | Native hooks (`useSelect`, `useMultiSelect`, …) |
| `@helpwave/hightide-native/icons` | Icon components |
| `@helpwave/hightide-native/theme` | Theme factories and style resolvers |
| `@helpwave/hightide-native/types` | Shared TypeScript types |

## Development

From the monorepo root:

```bash
pnpm --filter @helpwave/hightide-native run init
pnpm --filter @helpwave/hightide-native run storybook
```
