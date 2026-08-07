import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { InputState } from './input-tokens'

export type SwitchState = InputState & {
  isActive?: boolean,
}

export type SwitchComponentResolverProps = {
  state: SwitchState,
}

export type SwitchTokens = {
  container: ContainerTokens,
  track: ContainerTokens,
  thumb: ContainerTokens,
}

export type SwitchTokenResolver = ComponentTokenResolver<
  SwitchComponentResolverProps,
  SwitchTokens
>

const TRACK_WIDTH = 44
const TRACK_HEIGHT = 28
const THUMB_SIZE_ACTIVE = 20
const THUMB_SIZE_INACTIVE = 16

export const switchTokenResolver: SwitchTokenResolver = ({
  themeTokens,
  semanticResolvers,
  state,
}) => {
  const { color, borders } = themeTokens
  const mediumControl = semanticResolvers.controlLayout({ themeTokens, size: 'md' })
  const onColor = color.surface.onColor
  const borderWidth = borders.borderWidths.normal
  const focusOutline = themeTokens.focusOutline
  const thumbSize = state.isActive ? THUMB_SIZE_ACTIVE : THUMB_SIZE_INACTIVE
  const fadedBorder = semanticResolvers.asFaded({
    themeTokens,
    color: onColor,
  })
  const subtleThumb = semanticResolvers.withAppearance({
    themeTokens,
    color: onColor,
    appearance: 'subtle',
  })
  const disabledTrack = semanticResolvers.tintedSurface({
    themeTokens,
    tintColor: color.disabled.color,
    tintStrength: 'strong',
  })
  const trackActive = state.isDisabled ? disabledTrack : color.primary.color
  const trackInactive = state.isDisabled ? disabledTrack : color.surface.color
  const trackBackground = state.isActive ? trackActive : trackInactive
  const trackBorderColor = state.isDisabled
    ? disabledTrack
    : state.isInvalid
      ? color.negative.color
      : state.isActive ? trackActive : fadedBorder
  const thumbColor = state.isDisabled
    ? color.disabled.onColor
    : state.isActive ? color.primary.onColor : subtleThumb

  return {
    container: {
      size: {
        width: mediumControl.size,
        height: mediumControl.size,
        minWidth: mediumControl.size,
        maxWidth: mediumControl.size,
        minHeight: mediumControl.size,
        maxHeight: mediumControl.size,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
      outline: state.isFocused ? {
        color: 'transparent',
      } : undefined,
    },
    track: {
      backgroundColor: trackBackground,
      border: {
        width: {
          type: 'all',
          value: borderWidth,
        },
        color: {
          type: 'all',
          value: trackBorderColor,
        },
      },
      size: {
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
      },
      shape: {
        borderRadius: TRACK_HEIGHT / 2,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'start',
        crossAxisAligment: 'center',
      },
      outline: state.isFocused ? {
        ...focusOutline,
        color: color.primary.color,
      } : undefined,
    },
    thumb: {
      backgroundColor: thumbColor,
      size: {
        width: thumbSize,
        height: thumbSize,
      },
      shape: {
        borderRadius: thumbSize / 2,
      },
    },
  }
}
