# helpwave hightide

This repository contains all components and themes employed by helpwave's web application

## Theming

Theming is achieved through an extensive [tailwindcss](https://tailwindcss.com) config in
the [globals.css](src/style/globals.css)

## Storybook

We use [storybook](https://storybook.js.org/) for easily testing and showcasing our component library

```bash
npm run storybook
```

### Publishing a new version

- Run the barreling script

```bash
npm run barrel
```

- Increase the version number in the [package.json](package.json)

```bash
npm run build
```

- Update the [CHANGELOG.md](CHANGELOG.md)