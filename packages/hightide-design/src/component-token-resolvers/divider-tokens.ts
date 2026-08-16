import type { ColorToken } from '../primitive-tokens/color'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'

export type DividerDirection = 'horizontal' | 'vertical'

export type DividerComponentResolverProps = {
  overrides?: {
    direction?: DividerDirection,
    color?: ColorToken,
    width?: number,
    margin?: number,
  },
}

export type DividerTokens = ContainerTokens

export type DividerTokenResolver = ComponentTokenResolver<
  DividerComponentResolverProps,
  DividerTokens
>

export const dividerTokenResolver: DividerTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
}) => {
  const direction = overrides?.direction ?? 'horizontal'
  const width = overrides?.width ?? 1
  const margin = overrides?.margin ?? themeTokens.shape.padding.md
  const color = overrides?.color ?? semanticResolvers.asFaded({
    themeTokens,
    color: themeTokens.color.surface.onColor,
  })

  if (direction === 'vertical') {
    return {
      margin: {
        type: 'physicalAxis',
        vertical: margin,
      },
      border: {
        width: {
          type: 'physicalSide',
          right: width,
        },
        color: {
          type: 'physicalSide',
          right: color,
        },
        style: 'solid',
      },
    }
  }

  return {
    margin: {
      type: 'physicalAxis',
      horizontal: margin,
    },
    border: {
      width: {
        type: 'physicalSide',
        bottom: width,
      },
      color: {
        type: 'physicalSide',
        bottom: color,
      },
      style: 'solid',
    },
  }
}
