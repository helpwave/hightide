# helpwave hightide

This repository contains all components and themes employed by helpwave's web application


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
npm run build-production
```
