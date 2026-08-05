import type { ChipColoringStyle } from '../semantic-token-resolvers/types'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import { resolveColorPairColoring } from './coloring'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export type ChipComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    coloringStyle?: ChipColoringStyle,
  },
}

export type ChipTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
}

export type ChipTokenResolver = ComponentTokenResolver<
  ChipComponentResolverProps,
  ChipTokens
>

export const chipTokenResolver: ChipTokenResolver = ({ themeTokens, semanticResolvers, overrides }) => {
  const size = overrides.size ?? 'md'
  const coloring = resolveColorPairColoring({
    themeTokens,
    semanticResolvers,
    colorPair: overrides.color ?? themeTokens.color.primary,
    style: overrides.coloringStyle ?? 'filled',
  })
  const layout = createElementLayoutTokens(themeTokens).insideControl[size]
  const textStyle = themeTokens.typography.label[size]
  const gap = size === 'sm' ? themeTokens.spacing.xs : themeTokens.spacing.sm

  return {
    container: {
      backgroundColor: coloring.color,
      border: {
        width: layout.borderWidth,
        color: coloring.outlineColor ?? coloring.borderColor,
      },
      size: {
        minWidth: 0,
        minHeight: layout.size,
      },
      shape: {
        borderRadius: layout.borderRadius,
        padding: {
          vertical: layout.inset,
          horizontal: layout.inset + layout.paddingExtension,
        },
      },
      layout: { gap },
    },
    text: {
      ...textStyle,
      color: coloring.onColor,
    },
  }
}
