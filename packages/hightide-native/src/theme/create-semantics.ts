import {
  resolveTokens,
  type TokenResolveContext
} from '@helpwave/hightide-design/resolver'
import {
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
} from '@helpwave/hightide-design/semantic-tokens'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'
import type { HexColor } from './types/color'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import type { TokenContextInput } from './token-context'
import { bindTokenContext } from './token-context'
import type {
  Coloring,
  ColoringColors,
  ControlLayout,
  ContainerLayout,
  InputColoring,
  InsideControlLayout,
  PressableColoring
} from './types/semantics'

const asHex = (value: unknown): HexColor => {
  if (typeof value === 'string' && value.startsWith('#')) {
    return value as HexColor
  }
  if (
    typeof value === 'object'
    && value !== null
    && 'value' in value
    && typeof (value as { value: unknown }).value === 'string'
  ) {
    return (value as { value: HexColor }).value
  }
  throw new Error(`Expected HexColor, received ${String(value)}`)
}

const asNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return value
  }
  if (
    typeof value === 'object'
    && value !== null
    && 'value' in value
    && typeof (value as { value: unknown }).value === 'number'
  ) {
    return (value as { value: number }).value
  }
  throw new Error(`Expected number, received ${String(value)}`)
}

export const createSemantics = (themeTokens: ThemeTokens) => {
  const bind = bindTokenContext(themeTokens, semanticTokens)

  const resolve = <T>(tokens: unknown, input: TokenContextInput = {}): T => (
    resolveTokens(tokens, bind(input) as TokenResolveContext) as T
  )

  return {
    colors: {
      coloringColorVariant: (input: TokenContextInput = {}): ColoringColors => {
        const resolved = resolve<ColoringColors>(coloringVariantTokens, input)
        return {
          color: asHex(resolved.color),
          onColor: asHex(resolved.onColor),
          accent: asHex(resolved.accent),
        }
      },
      coloringStyle: (input: TokenContextInput = {}): Coloring => {
        const resolved = resolve<Coloring>(coloringStyleTokens, input)
        return {
          foreground: asHex(resolved.foreground),
          background: asHex(resolved.background),
          accent: asHex(resolved.accent),
        }
      },
      pressableColoring: (input: TokenContextInput = {}): PressableColoring => {
        const resolved = resolve<PressableColoring>(pressableColoringTokens, input)
        return {
          background: asHex(resolved.background),
          foreground: asHex(resolved.foreground),
          border: asHex(resolved.border),
          outline: asHex(resolved.outline),
        }
      },
      pressableStateLayerTint: (input: TokenContextInput = {}): HexColor => {
        const tintParam = input.params?.colors?.tint
        if (tintParam === undefined) {
          return HexColorUtils.transparent
        }
        try {
          if (asHex(tintParam) === HexColorUtils.transparent) {
            return HexColorUtils.transparent
          }
        } catch {
          return HexColorUtils.transparent
        }
        const resolved = resolve<{ tint: unknown }>(pressableStateLayerTintTokens, input)
        return asHex(resolved.tint)
      },
      inputColoring: (input: TokenContextInput = {}): InputColoring => {
        const resolved = resolve<InputColoring>(inputColoringTokens, input)
        return {
          background: asHex(resolved.background),
          text: asHex(resolved.text),
          border: asHex(resolved.border),
        }
      },
      tintedSurface: (input: TokenContextInput = {}): HexColor => {
        const strength = (input.config?.tintStrength as 'light' | 'normal' | 'strong' | undefined) ?? 'light'
        return asHex(resolve(tintedSurfaceTokens[strength], input))
      },
      withAppearance: (input: TokenContextInput = {}): HexColor => {
        const appearance = (input.config?.appearance as Appearance | undefined) ?? 'normal'
        return asHex(resolve(withAppearanceTokens[appearance], input))
      },
      asFaded: (input: TokenContextInput = {}): HexColor => (
        asHex(resolve(withAppearanceTokens.faded, input))
      ),
      asDescription: (input: TokenContextInput = {}): HexColor => (
        asHex(resolve(withAppearanceTokens.subtle, input))
      ),
    },
    numbers: {
      touchTargetSize: (input: TokenContextInput = {}): number => (
        asNumber(resolve(touchTargetSizeTokens, input))
      ),
      controlLayout: (input: TokenContextInput = {}): ControlLayout => {
        const resolved = resolve<ControlLayout>(controlLayoutTokens, input)
        return {
          size: asNumber(resolved.size),
          inset: asNumber(resolved.inset),
          borderWidth: asNumber(resolved.borderWidth),
          borderRadius: asNumber(resolved.borderRadius),
          horizontalContentPadding: asNumber(resolved.horizontalContentPadding),
        }
      },
      containerLayout: (input: TokenContextInput = {}): ContainerLayout => {
        const resolved = resolve<ContainerLayout>(containerLayoutTokens, input)
        return {
          size: asNumber(resolved.size),
          insetY: asNumber(resolved.insetY),
          insetX: asNumber(resolved.insetX),
          borderRadius: asNumber(resolved.borderRadius),
          minimumWidth: asNumber(resolved.minimumWidth),
          minimumHeight: asNumber(resolved.minimumHeight),
        }
      },
      insideControlLayout: (input: TokenContextInput = {}): InsideControlLayout => {
        const resolved = resolve<InsideControlLayout>(insideControlLayoutTokens, input)
        return {
          size: asNumber(resolved.size),
          inset: asNumber(resolved.inset),
          borderWidth: asNumber(resolved.borderWidth),
          borderRadius: asNumber(resolved.borderRadius),
          paddingExtension: asNumber(resolved.paddingExtension),
        }
      },
    },
  }
}
