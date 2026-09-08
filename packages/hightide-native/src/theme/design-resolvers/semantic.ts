import type { ColorToken, HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import type { ColorPairToken, ThemeLayoutSize, TintStrength } from '@helpwave/hightide-design/theme-tokens'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'
import type { InputState, PressableState, PressableStateValue } from '@helpwave/hightide-design/component-tokens'
import {
  buttonVariantMapping,
  coloringStyleTokens,
  coloringVariantTokens,
  containerLayoutTokens,
  controlLayoutTokens,
  inputColoringTokens,
  insideControlLayoutTokens,
  pressableColoringTokens,
  pressableStateLayerTintTokens,
  semanticTokens,
  tintedSurfaceTokens,
  touchTargetSizeTokens,
  withAppearanceTokens,
  type Appearance,
  type ButtonVariant,
  type ColoringColorTokens,
  type ColoringColorVariant,
  type ColoringStyle,
  type ColoringToken,
  type ContainerLayoutToken,
  type ControlElementLayoutToken,
  type InputColoringTokens,
  type InsideControlElementLayoutToken,
  type PressableColoringTokens,
  type SemanticTokenResolvers
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveResolvableValue, resolveTokenConfig } from '../static-resolve/resolve'

const layoutContext = (themeTokens: ThemeTokens) => ({
  theme: themeTokens,
})

export const resolveColoringColorVariant = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
  variant: ColoringColorVariant,
}): ColoringColorTokens => (
  resolveTokenConfig<ColoringColorTokens>(
    coloringVariantTokens,
    new Set(),
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      params: {
        colorPair: params.colorPair,
      },
      config: {
        coloringColorVariant: params.variant,
      },
    }
  )
)

export const resolveColoringStyle = (params: {
  themeTokens: ThemeTokens,
  coloring: ColoringColorTokens,
  style: ColoringStyle,
}): ColoringToken => (
  resolveTokenConfig<ColoringToken>(
    coloringStyleTokens,
    new Set(),
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      params: {
        coloring: params.coloring,
      },
      config: {
        coloringStyle: params.style,
      },
    }
  )
)

export const mapButtonVariant = (
  variant: ButtonVariant
) => buttonVariantMapping[variant]

export const resolveControlLayout = (params: {
  themeTokens: ThemeTokens,
  size: ThemeLayoutSize,
}): ControlElementLayoutToken => (
  resolveResolvableValue(
    controlLayoutTokens[params.size],
    layoutContext(params.themeTokens)
  ) as ControlElementLayoutToken
)

export const resolveTouchTargetSize = (params: {
  themeTokens: ThemeTokens,
}): number => (
  resolveResolvableValue(
    touchTargetSizeTokens,
    layoutContext(params.themeTokens)
  ) as number
)

export const resolveContainerLayout = (params: {
  themeTokens: ThemeTokens,
  size: ThemeLayoutSize,
}): ContainerLayoutToken => (
  resolveResolvableValue(
    containerLayoutTokens[params.size],
    layoutContext(params.themeTokens)
  ) as ContainerLayoutToken
)

export const resolveInsideControlLayout = (params: {
  themeTokens: ThemeTokens,
  size: ThemeLayoutSize,
}): InsideControlElementLayoutToken => (
  resolveResolvableValue(
    insideControlLayoutTokens[params.size],
    layoutContext(params.themeTokens)
  ) as InsideControlElementLayoutToken
)

export const resolveInputColoring = (params: {
  themeTokens: ThemeTokens,
  state: InputState,
  color?: ColorPairToken,
}): InputColoringTokens => {
  const accentPair = params.color ?? params.themeTokens.color.primary
  const states = new Set<'disabled' | 'invalid' | 'focused'>()

  if (params.state.has('disabled')) {
    states.add('disabled')
  }

  if (params.state.has('invalid')) {
    states.add('invalid')
  }

  if (params.state.has('focused')) {
    states.add('focused')
  }

  return resolveTokenConfig<InputColoringTokens>(
    inputColoringTokens,
    states,
    {
      theme: params.themeTokens,
      params: {
        accentPair,
      },
    }
  )
}

export const resolvePressableStateLayerTint = (params: {
  themeTokens: ThemeTokens,
  states: PressableState,
  color: ColorToken,
}): ColorToken => {
  if (params.color === HexColorUtils.transparent) {
    return HexColorUtils.transparent
  }

  return resolveTokenConfig<{ tint: ColorToken }>(
    pressableStateLayerTintTokens,
    params.states,
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      params: {
        color: params.color,
      },
    }
  ).tint
}

export const resolvePressableColoring = (params: {
  themeTokens: ThemeTokens,
  coloring: ColoringToken,
  variant: ButtonVariant,
  state: PressableState,
}): PressableColoringTokens => {
  const { colorVariant, style } = mapButtonVariant(params.variant)
  const disabledColoring = resolveColoringStyle({
    themeTokens: params.themeTokens,
    coloring: resolveColoringColorVariant({
      themeTokens: params.themeTokens,
      colorPair: params.themeTokens.color.disabled,
      variant: colorVariant,
    }),
    style,
  })
  const states = new Set<ButtonVariant | PressableStateValue>([
    ...params.state,
    params.variant,
  ])

  return resolveTokenConfig<PressableColoringTokens>(
    pressableColoringTokens,
    states,
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      params: {
        coloring: params.coloring,
        disabledColoring,
      },
      config: {
        variant: params.variant,
      },
    }
  )
}

export const resolveTintedSurface = (params: {
  themeTokens: ThemeTokens,
  tintColor: HexColorToken,
  tintStrength?: TintStrength,
}): HexColorToken => {
  const strength = params.tintStrength ?? 'light'

  return resolveResolvableValue(
    tintedSurfaceTokens[strength],
    {
      theme: params.themeTokens,
      params: {
        tintColor: params.tintColor,
      },
    }
  ) as HexColorToken
}

export const resolveWithAppearance = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
  appearance: Appearance,
}): HexColorToken => (
  resolveResolvableValue(
    withAppearanceTokens[params.appearance],
    {
      theme: params.themeTokens,
      params: {
        colorPair: params.colorPair,
      },
    }
  ) as HexColorToken
)

export const resolveAsFaded = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
}): HexColorToken => (
  resolveWithAppearance({
    themeTokens: params.themeTokens,
    colorPair: params.colorPair,
    appearance: 'faded',
  })
)

export const resolveAsDescription = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
}): HexColorToken => (
  resolveWithAppearance({
    themeTokens: params.themeTokens,
    colorPair: params.colorPair,
    appearance: 'subtle',
  })
)

export const hightideSemanticTokenResolvers: SemanticTokenResolvers = {
  coloringColorVariant: resolveColoringColorVariant,
  coloringStyle: resolveColoringStyle,
  pressableColoring: resolvePressableColoring,
  pressableStateLayerTint: resolvePressableStateLayerTint,
  inputColoring: resolveInputColoring,
  controlLayout: resolveControlLayout,
  touchTargetSize: resolveTouchTargetSize,
  containerLayout: resolveContainerLayout,
  insideControlLayout: resolveInsideControlLayout,
  tintedSurface: resolveTintedSurface,
  withAppearance: resolveWithAppearance,
  asFaded: resolveAsFaded,
  asDescription: resolveAsDescription,
}
