import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { createColorSchemeTokensFromThemeTokens } from '../theme-tokens/color-scheme'
import type {
  ChipColoringStyle,
  ColoringType
} from '../theme-tokens/color-scheme'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { toColorStateFull } from './pressable'

export type ChipState = {
  size?: ComponentSize,
  color?: ColoringType,
  coloringStyle?: ChipColoringStyle,
}

export type ChipThemeTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
}

export const hightideChipTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  ChipState,
  ChipThemeTokens
> = ({ themeTokens, state }) => {
  const size = state.size ?? 'md'
  const color = state.color ?? 'neutral'
  const coloringStyle = state.coloringStyle ?? 'filled'
  const colorSchemes = createColorSchemeTokensFromThemeTokens(themeTokens)
  const colorState = toColorStateFull(
    colorSchemes[color][coloringStyle].base,
    coloringStyle,
    themeTokens.color.transparent
  )
  const layout = createElementLayoutTokens(themeTokens).insideControl[size]
  const textStyle = themeTokens.typography.label[size]
  const gap = size === 'sm' ? themeTokens.spacing.xs : themeTokens.spacing.sm

  return {
    container: {
      backgroundColor: colorState.color,
      border: {
        width: layout.borderWidth,
        color: colorState.border,
      },
      size: {
        minWidth: 0,
        minHeight: layout.size,
      },
      shape: {
        borderRadius: layout.borderRadius,
        padding: {
          vertical: layout.inset,
          horizontal: layout.inset + layout.paddingExtension,
        },
      },
      layout: { gap },
    },
    text: {
      ...textStyle,
      color: colorState.foreground,
    },
  }
}
