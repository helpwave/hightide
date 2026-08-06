import { createElementLayoutTokens } from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { createIconSizeTokens, type IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export type InputState = {
  isHovered?: boolean,
  isFocused?: boolean,
  isDisabled?: boolean,
  isReadonly?: boolean,
  isInvalid?: boolean,
}

export type InputComponentResolverProps = {
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
  state,
}) => {
  const { color, spacing, borders, typography } = themeTokens
  const layout = createElementLayoutTokens(themeTokens).control.md
  const textStyle = typography.label.md
  const iconSizeTokens = createIconSizeTokens(themeTokens).md
  const onColor = color.surface.onColor
  const textColor = state.isDisabled ? color.disabled.onColor : onColor
  const borderColor = semanticResolvers.asFaded({
    themeTokens,
    semanticResolvers,
    color: onColor,
  })
  const placeholderColor = semanticResolvers.asDescription({
    themeTokens,
    semanticResolvers,
    color: onColor,
  })

  return {
    container: {
      backgroundColor: state.isDisabled ? color.disabled.color : color.surfaceVariant.color,
      border: {
        width: {
          type: 'all',
          value: borders.borderWidths.thin,
        },
        color: {
          type: 'all',
          value: state.isInvalid ? color.negative.color : borderColor,
        },
      },
      size: {
        minHeight: layout.size,
        width: '100%',
      },
      shape: {
        borderRadius: layout.borderRadius,
        padding: {
          vertical: spacing.sm,
          horizontal: spacing.md,
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
      color: textColor,
    },
    placeholder: {
      ...textStyle,
      color: placeholderColor,
    },
    icon: {
      size: iconSizeTokens.size,
      strokeWidth: iconSizeTokens.strokeWidth,
      color: textColor,
    },
  }
}
