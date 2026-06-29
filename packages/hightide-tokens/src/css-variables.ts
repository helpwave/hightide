import type { SemanticColors } from './semantic'
import { darkColors, lightColors } from './semantic'

const camelToKebab = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/** The CSS custom-property name for a semantic color (e.g. `onSurface` -> `--color-on-surface`). */
export const cssVarName = (token: keyof SemanticColors): string => `--color-${camelToKebab(token)}`

/** A flat `{ '--color-*': '#hex' }` map for a resolved color scheme. */
export const cssVariablesFor = (colors: SemanticColors): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const key of Object.keys(colors) as (keyof SemanticColors)[]) {
    result[cssVarName(key)] = colors[key]
  }
  return result
}

export const cssVariables = {
  light: cssVariablesFor(lightColors),
  dark: cssVariablesFor(darkColors),
}

const block = (selector: string, vars: Record<string, string>): string => {
  const body = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')
  return `${selector} {\n${body}\n}`
}

/**
 * Generates a `global.css` exposing every semantic color as a CSS custom
 * property, mirroring the web library's `[data-theme]` strategy.
 *
 * NativeWind (v4+) reads these variables on native too, so a single stylesheet
 * drives light/dark theming on every platform. Dark mode is toggled either by
 * the `.dark` class (NativeWind `colorScheme`) or the OS preference.
 *
 * @param options.darkModeSelector selector that activates the dark palette
 *        (defaults to `.dark`, NativeWind's convention).
 * @param options.includePrefersColorScheme also emit a `prefers-color-scheme`
 *        media query so the OS preference applies without JS.
 */
export const createGlobalCss = (options?: {
  darkModeSelector?: string,
  includePrefersColorScheme?: boolean,
}): string => {
  const darkSelector = options?.darkModeSelector ?? '.dark'
  const parts = [
    '/* Generated from @helpwave/hightide-tokens. Do not edit by hand. */',
    block(':root', cssVariables.light),
    block(darkSelector, cssVariables.dark),
  ]
  if (options?.includePrefersColorScheme) {
    parts.push(`@media (prefers-color-scheme: dark) {\n${block('  :root', cssVariables.dark)}\n}`)
  }
  return parts.join('\n\n') + '\n'
}
