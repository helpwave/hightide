import type { ColorToken, ColorToken } from '@helpwave/hightide-design/primitive-tokens'
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
import { resolveResolvableValue, resolveConfigNode } from '@helpwave/hightide-design/component-tokens'

const layoutContext = (themeTokens: ThemeTokens) => ({
  theme: themeTokens,
})

export const resolveColoringColorVariant = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
  variant: ColoringColorVariant,
}): ColoringColorTokens => (
  resolveConfigNode<ColoringColorTokens>(
    coloringVariantTokens,
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      params: {
        colors: {
          color: params.colorPair.color,
          onColor: params.colorPair.onColor,
        },
      },
      config: {
        coloringColorVariant: params.variant,
      },
      state: new Set(),
    }
  )
)

export const resolveColoringStyle = (params: {
  themeTokens: ThemeTokens,
  coloring: ColoringColorTokens,
  style: ColoringStyle,
}): ColoringToken => (
  resolveConfigNode<ColoringToken>(
    coloringStyleTokens,
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      params: {
        colors: {
          color: params.coloring.color,
          onColor: params.coloring.onColor,
          accent: params.coloring.accent,
        },
      },
      config: {
        coloringStyle: params.style,
      },
      state: new Set(),
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
  resolveConfigNode<ControlElementLayoutToken>(
    controlLayoutTokens,
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      config: {
        size: params.size,
      },
      state: new Set(),
    }
  )
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
  resolveConfigNode<ContainerLayoutToken>(
    containerLayoutTokens,
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      config: {
        size: params.size,
      },
      state: new Set(),
    }
  )
)

export const resolveInsideControlLayout = (params: {
  themeTokens: ThemeTokens,
  size: ThemeLayoutSize,
}): InsideControlElementLayoutToken => (
  resolveConfigNode<InsideControlElementLayoutToken>(
    insideControlLayoutTokens,
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      config: {
        size: params.size,
      },
      state: new Set(),
    }
  )
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

  return resolveConfigNode<InputColoringTokens>(
    inputColoringTokens,
    {
      theme: params.themeTokens,
      params: {
        colors: {
          accent: accentPair.color,
        },
      },
      state: states,
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

  return resolveConfigNode<{ tint: ColorToken }>(
    pressableStateLayerTintTokens,
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      params: {
        colors: {
          tint: params.color,
        },
      },
      state: params.states,
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

  return resolveConfigNode<PressableColoringTokens>(
    pressableColoringTokens,
    {
      theme: params.themeTokens,
      semantics: semanticTokens,
      params: {
        colors: {
          background: params.coloring.background,
          foreground: params.coloring.foreground,
          accent: params.coloring.accent,
          disabledBackground: disabledColoring.background,
          disabledForeground: disabledColoring.foreground,
        },
      },
      config: {
        variant: params.variant,
      },
      state: states,
    }
  )
}

export const resolveTintedSurface = (params: {
  themeTokens: ThemeTokens,
  tintColor: ColorToken,
  tintStrength?: TintStrength,
}): ColorToken => {
  const strength = params.tintStrength ?? 'light'

  return resolveResolvableValue(
    tintedSurfaceTokens[strength],
    {
      theme: params.themeTokens,
      params: {
        colors: {
          tintColor: params.tintColor,
        },
      },
    }
  ) as ColorToken
}

export const resolveWithAppearance = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
  appearance: Appearance,
}): ColorToken => (
  resolveResolvableValue(
    withAppearanceTokens[params.appearance],
    {
      theme: params.themeTokens,
      params: {
        colors: {
          color: params.colorPair.color,
          onColor: params.colorPair.onColor,
        },
      },
    }
  ) as ColorToken
)

export const resolveAsFaded = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
}): ColorToken => (
  resolveWithAppearance({
    themeTokens: params.themeTokens,
    colorPair: params.colorPair,
    appearance: 'faded',
  })
)

export const resolveAsDescription = (params: {
  themeTokens: ThemeTokens,
  colorPair: ColorPairToken,
}): ColorToken => (
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
