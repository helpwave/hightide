import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import { resolveColorPairColoring } from './coloring'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { InputState } from './input-tokens'

export type CheckboxState = InputState & {
  isChecked?: boolean,
  isIndeterminate?: boolean,
  isPressed?: boolean,
}

export type CheckboxComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    isRounded?: boolean,
  },
  state: CheckboxState,
}

export type CheckboxTokens = {
  container: ContainerTokens,
  visualContainer: ContainerTokens,
  icon: IconTokens,
}

export type CheckboxTokenResolver = ComponentTokenResolver<
  CheckboxComponentResolverProps,
  CheckboxTokens
>

export const checkboxTokenResolver: CheckboxTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const { color, borders } = themeTokens
  const control = createElementLayoutTokens(themeTokens).control
  const mediumControl = control.md
  const element = control[size]
  const borderWidth = borders.borderWidths.normal
  const inset = control.xs.inset
  const dimension = element.size - 2 * element.inset - 2 * element.borderWidth
  const isActive = !!(state.isChecked || state.isIndeterminate)
  const fadedBorder = semanticResolvers.asFaded({
    themeTokens,
    semanticResolvers,
    color: color.surface.onColor,
  })
  const feedbackColoring = resolveColorPairColoring({
    themeTokens,
    semanticResolvers,
    colorPair: themeTokens.color.primary,
    style: 'text',
    state: {
      isDisabled: state.isDisabled,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isPressed: state.isPressed,
    },
  })

  const borderColor = state.isDisabled
    ? color.disabled.color
    : state.isInvalid
      ? color.negative.color
      : isActive ? color.primary.color : fadedBorder

  const backgroundColor = state.isDisabled
    ? color.disabled.color
    : isActive ? color.primary.color : color.surface.color

  return {
    container: {
      backgroundColor: feedbackColoring.color,
      size: {
        width: mediumControl.size,
        height: mediumControl.size,
        minWidth: mediumControl.size,
        maxWidth: mediumControl.size,
        minHeight: mediumControl.size,
        maxHeight: mediumControl.size,
      },
      shape: {
        borderRadius: mediumControl.size / 2,
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
    visualContainer: {
      backgroundColor,
      opacity: state.isDisabled ? 0.6 : 1,
      border: {
        width: {
          type: 'all',
          value: borderWidth,
        },
        color: {
          type: 'all',
          value: borderColor,
        },
      },
      size: {
        width: dimension,
        height: dimension,
      },
      shape: {
        borderRadius: overrides.isRounded ? dimension / 2 : themeTokens.shape.borderRadius.sm,
        padding: {
          vertical: inset,
          horizontal: inset,
        },
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
      outline: state.isFocused ? {
        ...themeTokens.focusOutline,
        color: color.primary.color,
      } : undefined,
    },
    icon: {
      color: isActive ? color.primary.onColor : color.primary.color,
      size: dimension - 2 * inset - 2 * borderWidth,
      strokeWidth: borders.borderWidths.normal,
    },
  }
}
