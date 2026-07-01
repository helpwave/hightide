import type { TextStyle, ViewStyle } from 'react-native'
import type { ColoringRole, ColoringStyle, ResolvedColorRole, Theme } from '@helpwave/hightide-tokens'
import {
  resolveColorRole,
  TEXT_HOVER_BACKGROUND_OPACITY,
  TONAL_BACKGROUND_HOVER_OPACITY,
  TONAL_BACKGROUND_OPACITY,
} from '@helpwave/hightide-tokens'
import { withOpacity } from './color'
import { useHightideTheme } from '../theme/ThemeContext'

export type ColoringInput = {
  role: ColoringRole,
  coloringStyle: ColoringStyle,
  /** Press/hover state – maps to the web `:hover` treatment. */
  pressed?: boolean,
  disabled?: boolean,
}

export type ResolvedColoring = {
  /** Style for the element's container/track. */
  container: ViewStyle,
  /** Color for the element's label text. */
  label: TextStyle,
  /** Foreground color – use it for icons and other glyphs. */
  content: string,
}

const disabledRole = (theme: Theme): ResolvedColorRole => ({
  color: theme.colors.disabled,
  onColor: theme.colors.onDisabled,
  hover: theme.colors.disabled,
  text: theme.colors.disabled,
  textHover: theme.colors.disabled,
  outline: theme.colors.disabled,
  outlineHover: theme.colors.disabled,
  tonalBackground: theme.colors.disabled,
  tonalText: theme.colors.disabled,
})

/**
 * Turns a `(role, coloringStyle)` pair into concrete React Native styles,
 * reproducing the web `coloring-{solid,tonal,outline,text,tonal-outline}`
 * utilities exactly (including the tonal opacity steps and the hover/press
 * color swap).
 */
export const resolveColoring = (theme: Theme, input: ColoringInput): ResolvedColoring => {
  const { role, coloringStyle, pressed = false, disabled = false } = input
  const r = disabled ? disabledRole(theme) : resolveColorRole(role, theme.colors)
  const outlineWidth = theme.spacing.outlineWidth

  switch (coloringStyle) {
    case 'solid':
      return {
        container: { backgroundColor: pressed ? r.hover : r.color },
        label: { color: r.onColor },
        content: r.onColor,
      }

    case 'tonal':
      return {
        container: {
          backgroundColor: withOpacity(
            r.tonalBackground,
            pressed ? TONAL_BACKGROUND_HOVER_OPACITY : TONAL_BACKGROUND_OPACITY,
          ),
        },
        label: { color: r.tonalText },
        content: r.tonalText,
      }

    case 'outline': {
      const color = pressed ? r.outlineHover : r.outline
      return {
        container: { backgroundColor: 'transparent', borderWidth: outlineWidth, borderColor: color },
        label: { color },
        content: color,
      }
    }

    case 'tonal-outline': {
      const border = pressed ? r.outlineHover : r.outline
      return {
        container: {
          backgroundColor: withOpacity(
            r.tonalBackground,
            pressed ? TONAL_BACKGROUND_HOVER_OPACITY : TONAL_BACKGROUND_OPACITY,
          ),
          borderWidth: outlineWidth,
          borderColor: border,
        },
        label: { color: r.tonalText },
        content: r.tonalText,
      }
    }

    case 'text':
    default:
      return {
        container: {
          backgroundColor: pressed ? withOpacity(r.textHover, TEXT_HOVER_BACKGROUND_OPACITY) : 'transparent',
        },
        label: { color: r.text },
        content: r.text,
      }
  }
}

/** Hook variant of {@link resolveColoring} bound to the active theme. */
export const useColoring = (input: ColoringInput): ResolvedColoring => {
  const { theme } = useHightideTheme()
  return resolveColoring(theme, input)
}
