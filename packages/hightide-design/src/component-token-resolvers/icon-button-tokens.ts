import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { createColorSchemeTokensFromThemeTokens } from '../theme-tokens/color-scheme'
import type {
  ColoringType,
  PressableColoringStyle
} from '../theme-tokens/color-scheme'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import { resolveStateBasedProperty } from '../theme-tokens/stateBasedProperty'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { TextStyleTokens } from './text-style-tokens'
import type { PressableInteractionState } from './pressable'
import { toActivePressableStates, toPressableColorSchemes } from './pressable'

export type IconButtonState = PressableInteractionState & {
  size?: ComponentSize,
  color?: ColoringType,
  coloringStyle?: PressableColoringStyle,
}

export type IconButtonContainerTokens = {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: ColorToken,
  borderColor: ColorToken,
  borderWidth: number,
  width: number,
  height: number,
  borderRadius: number,
  overflow: 'hidden',
  opacity: number,
}

export type IconButtonIconTokens = {
  color: ColorToken,
}

export type IconButtonThemeTokens = {
  container: IconButtonContainerTokens,
  icon: IconButtonIconTokens,
  text: TextStyleTokens,
}

export const hightideIconButtonTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  IconButtonState,
  IconButtonThemeTokens
> = ({ themeTokens, state }) => {
  const size = state.size ?? 'md'
  const color = state.color ?? 'neutral'
  const coloringStyle = state.coloringStyle ?? 'filled'
  const colorSchemes = toPressableColorSchemes(
    createColorSchemeTokensFromThemeTokens(themeTokens)
  )
  const layout = createElementLayoutTokens(themeTokens).control[size]
  const resolved = resolveStateBasedProperty(
    colorSchemes[color][coloringStyle],
    toActivePressableStates(state)
  )
  const textStyle = themeTokens.typography.label[size]

  return {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.color,
      borderColor: resolved.border,
      borderWidth: layout.borderWidth,
      width: layout.size,
      height: layout.size,
      borderRadius: layout.borderRadius,
      overflow: 'hidden',
      opacity: state.isDisabled ? 0.6 : 1,
    },
    icon: {
      color: resolved.foreground,
    },
    text: {
      ...textStyle,
      color: resolved.foreground,
    },
  }
}
