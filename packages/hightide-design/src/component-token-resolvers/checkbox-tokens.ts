import { resolveInputColoring, type ComponentSize } from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { InputState } from './input-tokens'

export type CheckboxState = InputState & {
  isChecked?: boolean,
  isIndeterminate?: boolean,
}

export type CheckboxComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    isRounded?: boolean,
    color?: ColorPairToken,
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
  const accentPair = overrides.color ?? color.primary
  const mediumControl = semanticResolvers.controlLayout({ themeTokens, size: 'md' })
  const element = semanticResolvers.controlLayout({ themeTokens, size })
  const xsControl = semanticResolvers.controlLayout({ themeTokens, size: 'xs' })
  const borderWidth = borders.borderWidths.normal
  const inset = xsControl.inset
  const dimension = element.size - 2 * element.inset - 2 * element.borderWidth
  const isActive = !!(state.isChecked || state.isIndeterminate)
  const coloring = resolveInputColoring({
    themeTokens,
    state,
    color: overrides.color,
  })

  const backgroundColor = state.isDisabled
    ? color.disabled.color
    : isActive ? accentPair.color : color.surface.color

  return {
    container: {
      backgroundColor: coloring.shadow,
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
      border: isActive ? undefined : {
        width: {
          type: 'all',
          value: borderWidth,
        },
        color: {
          type: 'all',
          value: coloring.border,
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
      outline: coloring.outline !== undefined ? {
        ...themeTokens.focusOutline,
        color: coloring.outline,
      } : undefined,
    },
    icon: {
      color: isActive ? accentPair.onColor : accentPair.color,
      size: dimension - 2 * inset - 2 * borderWidth,
      strokeWidth: borders.borderWidths.normal,
    },
  }
}
