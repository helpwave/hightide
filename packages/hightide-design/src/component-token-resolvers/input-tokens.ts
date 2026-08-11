import { resolveInputColoring, resolvePressableStateLayerTint } from '../semantic-token-resolvers'
import { hightideShadow } from '../primitive-tokens/shadow'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { iconTokenResolver, type IconTokens } from './icon-tokens'
import type { PressableState } from './pressable'
import type { TextStyleTokens } from './text-style-tokens'

export type InputState = {
  isHovered?: boolean,
  isFocused?: boolean,
  isFocusVisible?: boolean,
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
  stateLayer: ContainerTokens,
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

  const interactionStates = new Set<PressableState>()
  if (state.isHovered === true && state.isFocused !== true) {
    interactionStates.add('hovered')
  }
  if (state.isPressed === true) {
    interactionStates.add('pressed')
  }

  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: interactionStates,
    color: coloring.text,
  })

  const focusShadow = state.isFocused === true && coloring.border !== 'transparent'
    ? {
      ...hightideShadow.layout.basic.md,
      color: HexColorUtils.hexWithAlpha(coloring.border, 0.7),
    }
    : undefined

  return {
    container: {
      backgroundColor: coloring.background,
      opacity: state.isDisabled ? 0.6 : 1,
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
      outline:  {
        ...themeTokens.focusOutline,
        color: !state.isFocusVisible ? 'transparent' :
          state.isInvalid === true
            ? themeTokens.color.negative.color
            : (overrides?.color ?? themeTokens.color.primary).color,
      },
      decoration: focusShadow !== undefined ? {
        shadow: focusShadow,
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
    stateLayer: {
      backgroundColor: tint,
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
