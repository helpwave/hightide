import type { ColorSchemeName, SemanticColors } from './semantic'
import { darkColors, lightColors } from './semantic'
import { typography } from './typography'
import { radii, elementRadius } from './radii'
import {
  elementGap,
  elementHeight,
  elementPaddingHorizontal,
  elementPaddingVertical,
  outlineWidth,
  SPACING_UNIT,
} from './spacing'
import { elevation } from './elevation'
import { durations } from './motion'

/**
 * A fully-resolved theme for one color scheme. This is the object the native
 * `HightideThemeProvider` puts on context, giving components a single, typed
 * source for every design value.
 */
export type Theme = {
  scheme: ColorSchemeName,
  colors: SemanticColors,
  typography: typeof typography,
  radii: typeof radii,
  elementRadius: typeof elementRadius,
  spacing: {
    unit: number,
    elementHeight: typeof elementHeight,
    elementPaddingVertical: typeof elementPaddingVertical,
    elementPaddingHorizontal: typeof elementPaddingHorizontal,
    elementGap: typeof elementGap,
    outlineWidth: number,
  },
  elevation: typeof elevation,
  durations: typeof durations,
}

const makeTheme = (scheme: ColorSchemeName, colors: SemanticColors): Theme => ({
  scheme,
  colors,
  typography,
  radii,
  elementRadius,
  spacing: {
    unit: SPACING_UNIT,
    elementHeight,
    elementPaddingVertical,
    elementPaddingHorizontal,
    elementGap,
    outlineWidth,
  },
  elevation,
  durations,
})

export const lightTheme: Theme = makeTheme('light', lightColors)
export const darkTheme: Theme = makeTheme('dark', darkColors)

export const themes: Record<ColorSchemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
}
