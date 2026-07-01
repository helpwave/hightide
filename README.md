# helpwave hightide

This repository contains all components and themes employed by helpwave's web application

## The hightide family (web + React Native)

hightide is a **hybrid design system**. The same design language is shared across
platforms through a small family of packages:

| Package | Platform | Location |
| --- | --- | --- |
| [`@helpwave/hightide`](package.json) | React (web) | this repo (root) |
| [`@helpwave/hightide-native`](packages/hightide-native) | React Native | `packages/hightide-native` |
| [`@helpwave/hightide-tokens`](packages/hightide-tokens) | shared design tokens | `packages/hightide-tokens` |

All three are released **in lockstep** (same version). The web library is
unchanged; the native library ships the _basic app building blocks_ (desktop-web
patterns like `AppPage`/`Carousel`/`Table` are intentionally excluded).

📖 Start with [`docs/native/ARCHITECTURE.md`](docs/native/ARCHITECTURE.md) for the
design rationale, styling strategy and npm packaging/versioning model, and
[`docs/native/COMPONENT-INVENTORY.md`](docs/native/COMPONENT-INVENTORY.md) for
what is/ isn't ported.


## Development - Getting Started
To start developing in the Project just run this command:
```bash
npm run init 
```

## Translations
Translations are handled similar to Flutter's intl package with `.arb` files using 
ICU patters for string replacements. These files are found in the [locales folder](locales/) 
and the typed translation are build with:
```bash
npm run build-translation
```
The resulting files are by default found in the [i18n folder](src/i18n/).

## Theming

Theming is achieved through an extensive [tailwindcss](https://tailwindcss.com) config in
the [globals.css](src/style/globals.css)

## Storybook

We use [storybook](https://storybook.js.org/) for easily testing and showcasing our component library

```bash
npm run storybook
```

### Publishing a new version

- Increase the version number in the [package.json](package.json)

- Update the [CHANGELOG.md](CHANGELOG.md)

```bash
npm run build
```
