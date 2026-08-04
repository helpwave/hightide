import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import type { ComponentTokenResolver } from './component-token-resolver'

export type SwitchState = {
  isActive?: boolean,
  isDisabled?: boolean,
  isInvalid?: boolean,
}

export type SwitchThemeTokens = {
  trackColor: ColorToken,
  borderColor: ColorToken,
  thumbColor: ColorToken,
}

export const hightideSwitchTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  SwitchState,
  SwitchThemeTokens
> = ({ themeTokens, state }) => {
  const { color } = themeTokens
  const trackActive = state.isDisabled ? color.disabled : color.primary.color
  const trackInactive = state.isDisabled ? color.disabled : color.surface

  const borderColor = state.isDisabled
    ? color.disabled
    : state.isInvalid
      ? color.negative.color
      : state.isActive ? trackActive : color.border

  const thumbColor = state.isDisabled
    ? color.onDisabled
    : state.isActive ? color.primary.onColor : color.subtle

  return {
    trackColor: state.isActive ? trackActive : trackInactive,
    borderColor,
    thumbColor,
  }
}
