# @helpwave/hightide-native

helpwave's _hightide_ design language for **React Native** – the basic building
blocks for mobile apps (buttons, cards, chips, avatars, toggles, …).

It is the native sibling of [`@helpwave/hightide`](../../README.md) (web) and
shares its design tokens through
[`@helpwave/hightide-tokens`](../hightide-tokens/README.md), so the two
libraries stay visually in sync and are released together.

> Scope: this package intentionally ships only the **app-appropriate** subset of
> hightide. Desktop-web patterns (AppPage, Carousel, Table, data-grid filtering,
> Markdown rendering, …) are **not** included – see the
> [component inventory](../../docs/native/COMPONENT-INVENTORY.md).

## Install

```bash
npm install @helpwave/hightide-native @helpwave/hightide-tokens
# peer deps
npm install react react-native
```

## Quick start

Wrap your app in the theme provider once, then use the components:

```tsx
import { HightideThemeProvider, Button, Card, Text } from '@helpwave/hightide-native'

export default function App() {
  return (
    <HightideThemeProvider>
      <Card title="Welcome" description="hightide on React Native">
        <Text variant="bodyMd" color="description">Pick a treatment:</Text>
        <Button color="primary" coloringStyle="solid" onPress={() => {}}>
          Continue
        </Button>
      </Card>
    </HightideThemeProvider>
  )
}
```

### Theming & dark mode

`HightideThemeProvider` follows the OS color scheme by default. Force a scheme
with `colorScheme="light" | "dark" | "system"`, or read/drive it yourself:

```tsx
import { useHightideTheme } from '@helpwave/hightide-native'

const { scheme, theme, setPreference } = useHightideTheme()
```

Every component resolves its colors from the active theme, so dark mode "just
works" once the provider is in place.

## Styling model

Components style themselves with React Native `StyleSheet` and the shared design
tokens, so they render correctly with **zero build configuration**. The full
role × treatment "coloring" model from the web library is reproduced exactly:

| `coloringStyle` | result |
| --- | --- |
| `solid` | filled background, on-color text |
| `tonal` | translucent background, role-colored text |
| `outline` | transparent with a role-colored border |
| `tonal-outline` | tonal background + border |
| `text` | text only, translucent press wash |

`color` accepts any of `primary`, `secondary`, `positive`, `warning`,
`negative`, `neutral`.

### Optional: NativeWind interop

If your app uses [NativeWind](https://www.nativewind.dev/), you get the hightide
design tokens as Tailwind utilities (`bg-primary`, `text-on-surface`,
`text-title-md`, …) and can extend any component via `className`.

```js
// tailwind.config.js
module.exports = {
  presets: [require('@helpwave/hightide-native/tailwind.preset')],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@helpwave/hightide-native/dist/**/*.js',
  ],
}
```

```css
/* global.css */
@import '@helpwave/hightide-native/global.css'; /* :root + .dark color variables */
```

NativeWind is an **optional** peer dependency – the library does not require it.

## Storybook

The components are previewed with Storybook through `react-native-web`:

```bash
npm run storybook        # http://localhost:6007
```

## Development

```bash
npm run typecheck        # tsc --noEmit
npm run build            # tsup -> dist (cjs + esm + types)
npm run gen:css          # regenerate global.css from the tokens
```
