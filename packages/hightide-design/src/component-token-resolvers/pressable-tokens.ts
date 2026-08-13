import {
  createColoringProperty,
  createPressableColoringTokens,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableStateLayerTint,
  toTypographySize,
  type ColoringColorVariant,
  type ColoringStyle,
  type ComponentSize
} from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { resolveStateBasedProperty } from '../theme-tokens/stateBasedProperty'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export const pressableStateValues = [
  'disabled',
  'focused',
  'focusVisible',
  'hovered',
  'pressed',
] as const

export type PressableStateValue = typeof pressableStateValues[number]

export type PressableState = ReadonlySet<PressableStateValue>

export const pressableStateValueSet: ReadonlySet<PressableStateValue> = new Set(pressableStateValues)

export const isPressableStateValue = (value: string): value is PressableStateValue => (
  pressableStateValueSet.has(value as PressableStateValue)
)

export const toPressableState = (state: ReadonlySet<string>): PressableState => {
  const active = new Set<PressableStateValue>()
  for (const value of state) {
    if (isPressableStateValue(value)) {
      active.add(value)
    }
  }
  return active
}

export type PressableComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    coloringStyle?: ColoringStyle,
    coloringColorVariant?: ColoringColorVariant,
    hasAdditionalHorizontalPadding?: boolean,
  },
  state: PressableState,
}

export type PressableTokens = {
  touchTarget: ContainerTokens,
  visualContainer: ContainerTokens,
  stateLayer: ContainerTokens,
  text: TextStyleTokens,
}

export type PressableTokenResolver = ComponentTokenResolver<
  PressableComponentResolverProps,
  PressableTokens
>

export const pressableTokenResolver: PressableTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const coloringStyle = overrides.coloringStyle ?? 'foreground'
  const coloringColorVariant = overrides.coloringColorVariant ?? 'normal'
  const hasAdditionalHorizontalPadding = overrides.hasAdditionalHorizontalPadding ?? false
  const colorPair = overrides.color ?? (
    coloringStyle === 'filled'
      ? themeTokens.color.surface
      : {
        color: themeTokens.color.surface.onColor,
        onColor: themeTokens.color.surface.color,
      }
  )
  const coloring = resolveColoringStyle({
    themeTokens,
    coloring: resolveColoringColorVariant({
      themeTokens,
      colorPair,
      variant: coloringColorVariant,
    }),
    style: coloringStyle,
  })
  const resolvedColoring = resolveStateBasedProperty(
    createColoringProperty(themeTokens, coloring, coloringColorVariant, coloringStyle),
    new Set([...state, coloringColorVariant])
  )
  const resolved = resolveStateBasedProperty(
    createPressableColoringTokens(resolvedColoring),
    state
  )
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: state,
    color: coloring.foreground,
  })
  const hasOutline = resolved.outline !== 'transparent'
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const touchTargetSize = semanticResolvers.touchTargetSize({ themeTokens })
  const textStyle = themeTokens.typography.label[toTypographySize(size)]
  const gap = themeTokens.spacing[size]

  return {
    touchTarget: {
      size: {
        minWidth: touchTargetSize,
        minHeight: touchTargetSize,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    visualContainer: {
      backgroundColor: resolved.background,
      opacity: state.has('disabled') ? 0.6 : 1,
      outline: hasOutline ? {
        width: themeTokens.focusOutline.width,
        offset: themeTokens.focusOutline.offset,
        style: themeTokens.focusOutline.style,
        color: resolved.outline,
      } : undefined,
      size: {
        minHeight: layout.size,
      },
      shape: {
        borderRadius: { type: 'all', value: layout.borderRadius },
      },
      padding: {
        type: 'physicalAxis',
        vertical: layout.inset,
        horizontal: hasAdditionalHorizontalPadding
          ? layout.horizontalContentPadding
          : layout.inset,
      },
      layout: {
        gap,
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    stateLayer: {
      backgroundColor: tint,
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
