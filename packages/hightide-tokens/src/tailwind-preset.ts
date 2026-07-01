import { palette } from './palette'
import type { SemanticColors } from './semantic'
import { lightColors } from './semantic'
import { cssVarName } from './css-variables'
import { fontFamilies, fontSizes, typography } from './typography'
import { radii } from './radii'
import {
  elementGap,
  elementHeight,
  elementPaddingHorizontal,
  elementPaddingVertical,
  outlineWidth,
} from './spacing'

/**
 * A minimal structural type for a Tailwind/NativeWind preset so this package
 * doesn't need a hard dependency on `tailwindcss`.
 */
export type TailwindPreset = {
  darkMode: string | string[],
  theme: {
    extend: Record<string, unknown>,
  },
}

/** Semantic colors resolved against the live CSS custom properties. */
const semanticColorVars = (): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const key of Object.keys(lightColors) as (keyof SemanticColors)[]) {
    // Reference the variable so light/dark swaps happen via the cascade /
    // NativeWind colorScheme rather than being baked in at build time.
    result[toUtilityName(key)] = `var(${cssVarName(key)})`
  }
  return result
}

/** `onSurface` -> `on-surface`, used for color utility names (`bg-on-surface`). */
const toUtilityName = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const fontSizeScale = (): Record<string, [string, { lineHeight: string }]> => {
  const result: Record<string, [string, { lineHeight: string }]> = {}
  for (const [name, { fontSize, lineHeight }] of Object.entries(fontSizes)) {
    result[name] = [`${fontSize}px`, { lineHeight: `${lineHeight}px` }]
  }
  // Named typographic roles -> `text-title-md`, `text-body-lg`, ...
  for (const [name, v] of Object.entries(typography)) {
    result[toUtilityName(name)] = [`${v.fontSize}px`, { lineHeight: `${v.lineHeight}px` }]
  }
  return result
}

const pxScale = (input: Record<string, number>): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const [name, value] of Object.entries(input)) {
    result[name] = `${value}px`
  }
  return result
}

/**
 * The shared Tailwind / NativeWind preset.
 *
 * Spread it into a `tailwind.config.js` on either platform:
 *
 * ```js
 * const { hightidePreset } = require('@helpwave/hightide-tokens')
 * module.exports = { presets: [hightidePreset], content: [...] }
 * ```
 *
 * Semantic colors point at CSS custom properties (see {@link createGlobalCss}),
 * so `bg-primary` / `text-on-surface` automatically follow the active theme.
 */
export const hightidePreset: TailwindPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...palette,
        ...semanticColorVars(),
      },
      fontFamily: {
        sans: [fontFamilies.sans, 'sans-serif'],
        display: [fontFamilies.display, 'sans-serif'],
      },
      fontSize: fontSizeScale(),
      borderRadius: {
        ...pxScale(radii),
      },
      height: {
        'element-xs': `${elementHeight.xs}px`,
        'element-sm': `${elementHeight.sm}px`,
        'element-md': `${elementHeight.md}px`,
        'element-lg': `${elementHeight.lg}px`,
      },
      gap: {
        'element-xs': `${elementGap.xs}px`,
        'element-sm': `${elementGap.sm}px`,
        'element-md': `${elementGap.md}px`,
        'element-lg': `${elementGap.lg}px`,
      },
      padding: {
        'element-x-xs': `${elementPaddingHorizontal.xs}px`,
        'element-x-sm': `${elementPaddingHorizontal.sm}px`,
        'element-x-md': `${elementPaddingHorizontal.md}px`,
        'element-x-lg': `${elementPaddingHorizontal.lg}px`,
        'element-y-xs': `${elementPaddingVertical.xs}px`,
        'element-y-sm': `${elementPaddingVertical.sm}px`,
        'element-y-md': `${elementPaddingVertical.md}px`,
        'element-y-lg': `${elementPaddingVertical.lg}px`,
      },
      borderWidth: {
        outline: `${outlineWidth}px`,
      },
    },
  },
}
