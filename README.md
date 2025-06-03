# helpwave hightide
This repository contains all components and themes employed by helpwave's web application

## Theming
Theming is achieved through an extensive [tailwindcss](https://tailwindcss.com) config in the [globals.css](src/css/globals.css)

## Storybook
We use [storybook](https://storybook.js.org/) for easily testing and showcasing our component library

### Publishing a new version
- Run the barreling script
```bash
npm run generate-barrels
```
- Increase the version number in the [package.json](package.json)
- Update the [CHANGELOG.md](CHANGELOG.md)