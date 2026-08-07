import { resolveInputColoring } from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { iconTokenResolver, type IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export type InputState = {
  isHovered?: boolean,
  isFocused?: boolean,
  isPressed?: boolean,
  isDisabled?: boolean,
  isReadonly?: boolean,
  isInvalid?: boolean,
}

export type InputComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: InputState,
}

export type InputTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
  placeholder: TextStyleTokens,
  icon: IconTokens,
}

export type InputTokenResolver = ComponentTokenResolver<
  InputComponentResolverProps,
  InputTokens
>

export const inputTokenResolver: InputTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const { spacing, typography } = themeTokens
  const layout = semanticResolvers.controlLayout({ themeTokens, size: 'md' })
  const textStyle = typography.body.md
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size: 'md' },
  })
  const coloring = resolveInputColoring({
    themeTokens,
    state,
    color: overrides?.color,
  })
  const placeholderColor = state.isDisabled
    ? themeTokens.color.disabled.onColor
    : semanticResolvers.asDescription({
      themeTokens,
      color: themeTokens.color.surface.onColor,
    })

  return {
    container: {
      backgroundColor: coloring.background,
      border: {
        width: {
          type: 'all',
          value: layout.borderWidth,
        },
        color: {
          type: 'all',
          value: coloring.border,
        },
      },
      outline: coloring.outline !== undefined ? {
        ...themeTokens.focusOutline,
        color: coloring.outline,
      } : undefined,
      size: {
        minHeight: layout.size,
        width: '100%',
      },
      shape: {
        borderRadius: layout.borderRadius,
        padding: {
          vertical: layout.inset,
          horizontal: layout.horizontalContentPadding - layout.borderWidth,
        },
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'start',
        crossAxisAligment: 'center',
        gap: spacing.sm,
      },
    },
    text: {
      ...textStyle,
      color: coloring.text,
    },
    placeholder: {
      ...textStyle,
      color: placeholderColor,
    },
    icon: {
      size: iconSizeTokens.size,
      strokeWidth: iconSizeTokens.strokeWidth,
      color: coloring.text,
    },
  }
}
