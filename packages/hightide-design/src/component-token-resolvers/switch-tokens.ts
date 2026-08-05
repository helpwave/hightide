import type { ColorToken } from '../primitive-tokens/color'
import type { ComponentTokenResolver } from './component-token-resolver'

export type SwitchState = {
  isActive?: boolean,
  isDisabled?: boolean,
  isInvalid?: boolean,
}

export type SwitchComponentResolverProps = {
  state: SwitchState,
}

export type SwitchThemeTokens = {
  trackColor: ColorToken,
  borderColor: ColorToken,
  thumbColor: ColorToken,
}

export const hightideSwitchTokenResolver: ComponentTokenResolver<
  SwitchComponentResolverProps,
  SwitchThemeTokens
> = ({ themeTokens, semanticResolvers, state }) => {
  const { color } = themeTokens
  const onColor = color.surface.onColor
  const fadedBorder = semanticResolvers.asFaded({
    themeTokens,
    semanticResolvers,
    color: onColor,
  })
  const subtleThumb = semanticResolvers.withAppearance({
    themeTokens,
    semanticResolvers,
    color: onColor,
    appearance: 'subtle',
  })
  const disabledTrack = semanticResolvers.tintedSurface({
    themeTokens,
    semanticResolvers,
    tintColor: color.disabled.color,
    tintStrength: 'strong',
  })
  const trackActive = state.isDisabled ? disabledTrack : color.primary.color
  const trackInactive = state.isDisabled ? disabledTrack : color.surface.color

  const borderColor = state.isDisabled
    ? disabledTrack
    : state.isInvalid
      ? color.negative.color
      : state.isActive ? trackActive : fadedBorder

  const thumbColor = state.isDisabled
    ? color.disabled.onColor
    : state.isActive ? color.primary.onColor : subtleThumb

  return {
    trackColor: state.isActive ? trackActive : trackInactive,
    borderColor,
    thumbColor,
  }
}
