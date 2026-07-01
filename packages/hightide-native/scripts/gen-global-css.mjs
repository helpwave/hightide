/**
 * Regenerates `global.css` from the shared design tokens. Run with:
 *   npm run gen:css
 *
 * The output exposes every semantic color as a CSS custom property for `:root`
 * and `.dark`, which NativeWind reads on both web and native.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createGlobalCss } from '@helpwave/hightide-tokens'

const here = dirname(fileURLToPath(import.meta.url))
const target = join(here, '..', 'global.css')

writeFileSync(target, createGlobalCss({ darkModeSelector: '.dark', includePrefersColorScheme: true }))

// eslint-disable-next-line no-console
console.info(`Wrote ${target}`)
