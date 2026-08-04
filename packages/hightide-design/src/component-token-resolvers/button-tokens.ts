import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import {
  createColorSchemeTokensFromThemeTokens
} from '../theme-tokens/color-scheme'
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
import type { ContainerTokens } from './container-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import type { PressableInteractionState } from './pressable'
import { toActivePressableStates, toPressableColorSchemes } from './pressable'

export type ButtonState = PressableInteractionState & {
  size?: ComponentSize,
  color?: ColoringType,
  coloringStyle?: PressableColoringStyle,
}

export type ButtonThemeTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
}

const isOutlineColoringStyle = (style: PressableColoringStyle): boolean => (
  style === 'outline' || style === 'tonal-outline'
)

export const hightideButtonTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  ButtonState,
  ButtonThemeTokens
> = ({ themeTokens, state }) => {
  const size = state.size ?? 'md'
  const color = state.color ?? 'primary'
  const coloringStyle = state.coloringStyle ?? 'filled'
  const colorSchemes = toPressableColorSchemes(
    createColorSchemeTokensFromThemeTokens(themeTokens)
  )
  const layout = createElementLayoutTokens(themeTokens).control[size]
  const resolved = resolveStateBasedProperty(
    colorSchemes[color][coloringStyle],
    toActivePressableStates(state)
  )
  const outlinePadding = isOutlineColoringStyle(coloringStyle)
  const outlineInset = Math.max(layout.inset - layout.borderWidth, 0)
  const textStyle = themeTokens.typography.label[size]
  const gap = size === 'sm' ? themeTokens.spacing.xs : themeTokens.spacing.sm

  return {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolved.color,
      borderColor: resolved.border,
      borderWidth: layout.borderWidth,
      paddingVertical: outlinePadding ? outlineInset : layout.inset,
      paddingHorizontal: outlinePadding
        ? Math.max(layout.horizontalContentPadding - layout.borderWidth, 0)
        : layout.horizontalContentPadding,
      gap,
      minWidth: layout.minimumWidth,
      minHeight: layout.size,
      borderRadius: layout.borderRadius,
      opacity: state.isDisabled ? 0.6 : 1,
    },
    text: {
      color: resolved.foreground,
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      fontFamily: textStyle.fontFamily,
      lineHeight: textStyle.lineHeight,
    },
  }
}
