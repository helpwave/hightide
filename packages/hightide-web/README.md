# helpwave hightide

This package contains all components and themes employed by helpwave's web application.

## Installing in your React app

### Step 1 — Install

```bash
pnpm add @helpwave/hightide
```

### Step 2 — Import the stylesheet

Import the pre-built CSS in your app entry point:

```ts
// app entry (main.tsx, index.tsx, layout.tsx, …)
import "@helpwave/hightide/style/globals.css";
```

Two stylesheet exports are available:

- `@helpwave/hightide/style/globals.css` — pre-built, prefixed CSS (**recommended**)
- `@helpwave/hightide/style/uncompiled/globals.css` — source CSS for apps that compile Tailwind themselves

### Step 3 — Wrap your app with `HightideProvider`

```tsx
import { HightideProvider } from "@helpwave/hightide";

<HightideProvider theme={{ theme: "system" }} locale={{ locale: "system" }}>
  {children}
</HightideProvider>;
```

### Step 4 — Use components

```tsx
import { LoadingAnimation } from "@helpwave/hightide";
```

### Uncompiled CSS path (advanced)

If you compile Tailwind in your own app, install `tailwindcss` and `@tailwindcss/postcss`, add a `postcss.config.mjs` matching hightide's setup, and import the uncompiled stylesheet:

```css
@import "tailwindcss";

@import "@helpwave/hightide/style/uncompiled/globals.css";
@source "./node_modules/@helpwave/hightide";

/* Your Custom Styles */
```

## Development — Getting Started

To start developing in the project, run:

```bash
pnpm run init
```

## Translations

Translations are handled similar to Flutter's intl package with `.arb` files using ICU patterns for string replacements. These files are found in the [locales folder](locales/) and the typed translations are built with:

```bash
pnpm run build-intl
```

The resulting files are by default found in the [i18n folder](src/i18n/).

## Theming

Theming is achieved through an extensive [tailwindcss](https://tailwindcss.com) config in the [globals.css](src/style/globals.css).

## Storybook

We use [storybook](https://storybook.js.org/) for easily testing and showcasing our component library.

```bash
pnpm run storybook
```

To test on physical devices over the local network:

```bash
pnpm run storybook:devices
```

Open `http://<your-ip>:6006` on your phone or tablet.

To build a static Storybook for hosted previews:

```bash
pnpm run build-storybook
```
