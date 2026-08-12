import {
  resolvePressableStateLayerTint
} from '../semantic-token-resolvers'
import { HexColorUtils } from '../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { inputStateValues } from './input-tokens'
import { toPressableState } from './pressable'

export const switchStateValues = [
  ...inputStateValues,
  'active',
] as const

export type SwitchStateValue = typeof switchStateValues[number]

export type SwitchState = ReadonlySet<SwitchStateValue>

export const switchStateValueSet: ReadonlySet<SwitchStateValue> = new Set(switchStateValues)

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
  const thumbSize = state.has('active') ? THUMB_SIZE_ACTIVE : THUMB_SIZE_INACTIVE
  const fadedBorder = semanticResolvers.asFaded({
    themeTokens,
    color: onColor,
  })
  const subtleThumb = semanticResolvers.withAppearance({
    themeTokens,
    color: onColor,
    appearance: 'subtle',
  })
  const trackActive = color.primary.color
  const trackInactive = color.surface.color
  const trackBackground = state.has('disabled')
    ? themeTokens.color.disabled.color
    : state.has('active') ? trackActive : trackInactive
  const trackBorderColor = state.has('disabled')
    ? themeTokens.color.disabled.color
    : state.has('invalid')
      ? color.negative.color
      : state.has('active') ? trackActive : fadedBorder
  const thumbColor = state.has('active') ? color.primary.onColor : subtleThumb
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: toPressableState(state),
    color: thumbColor,
  })
  const tintedTrackBackground = HexColorUtils.blend(
    trackBackground,
    tint === 'transparent' ? trackBackground : tint
  )
  const tintedBorder = HexColorUtils.blend(
    trackBorderColor,
    tint === 'transparent' ? trackBorderColor : tint
  )

  return {
    container: {
      opacity: state.has('disabled') ? 0.6 : 1,
      size: {
        width: mediumControl.size,
        height: mediumControl.size,
        minWidth: mediumControl.size,
        maxWidth: mediumControl.size,
        minHeight: mediumControl.size,
        maxHeight: mediumControl.size,
      },
      shape: {
        padding: {
          horizontal: (mediumControl.size - TRACK_HEIGHT) / 2,
          vertical: (mediumControl.size - TRACK_HEIGHT) / 2,
        }
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
      outline: state.has('focusVisible') ? {
        color: 'transparent',
      } : undefined,
    },
    track: {
      backgroundColor: tintedTrackBackground,
      border: {
        width: {
          type: 'all',
          value: borderWidth,
        },
        color: {
          type: 'all',
          value: tintedBorder,
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
      outline: state.has('focusVisible') ? {
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
