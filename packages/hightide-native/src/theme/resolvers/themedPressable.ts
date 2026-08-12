import type { ContainerTokens, TextStyleTokens } from '@helpwave/hightide-design/component-token-resolvers'
import {
  createColoringProperty,
  createPressableColoringTokens,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableStateLayerTint,
  toTypographySize,
  type ColoringColorVariant,
  type ColoringStyle,
  type ComponentSize,
  type SemanticTokenResolvers
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ColorPairToken, ThemeTokens } from '@helpwave/hightide-design/theme-tokens'
import { resolveStateBasedProperty } from '@helpwave/hightide-design/theme-tokens'
import type { PressableState } from '@helpwave/hightide-design/component-token-resolvers'

import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  ThemedPressableState,
  ThemedPressableStyle,
  ThemedPressableTextStyle,
  ThemedPressableThemeResolvers
} from '../types/components/themedPressable'
import {
  createStyleResolver,
  toPressableInteractionState,
  type ComponentThemeResolver
} from '../types/resolver'

type ThemedPressableTokens = {
  touchTarget: ContainerTokens,
  visualContainer: ContainerTokens,
  stateLayer: ContainerTokens,
  text: TextStyleTokens,
}

const resolveThemedPressableTokens = (params: {
  themeTokens: ThemeTokens,
  semanticResolvers: SemanticTokenResolvers,
  size: ComponentSize,
  color?: ColorPairToken,
  coloringStyle: ColoringStyle,
  coloringColorVariant: ColoringColorVariant,
  hasAdditionalHorizontalPadding: boolean,
  state: PressableState,
}): ThemedPressableTokens => {
  const {
    themeTokens,
    semanticResolvers,
    size,
    color,
    coloringStyle,
    coloringColorVariant,
    hasAdditionalHorizontalPadding,
    state,
  } = params
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const touchTargetSize = semanticResolvers.touchTargetSize({ themeTokens })
  const coloring = resolveColoringStyle({
    coloring: resolveColoringColorVariant({
      colorPair: color ??
      coloringStyle === 'filled' ?
        themeTokens.color.surface :
        {
          color: themeTokens.color.surface.onColor,
          onColor: themeTokens.color.surface.color,
        },
      variant: coloringColorVariant,
    }),
    style: coloringStyle,
  })
  const resolvedColoring = resolveStateBasedProperty(
    createColoringProperty(themeTokens, coloring, coloringColorVariant, coloringStyle),
    new Set([...state, coloringColorVariant])
  )
  const resolved = resolveStateBasedProperty(
    createPressableColoringTokens(resolvedColoring),
    state
  )
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: state,
    color: coloring.foreground,
  })
  const hasOutline = resolved.outline !== 'transparent'
  const textStyle = themeTokens.typography.label[toTypographySize(size)]
  const gap = themeTokens.spacing[size]

  return {
    touchTarget: {
      size: {
        minWidth: touchTargetSize,
        minHeight: touchTargetSize,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    visualContainer: {
      backgroundColor: resolved.background,
      opacity: state.has('disabled') ? 0.6 : 1,
      outline: hasOutline ? {
        width: themeTokens.focusOutline.width,
        offset: themeTokens.focusOutline.offset,
        style: themeTokens.focusOutline.style,
        color: resolved.outline,
      } : undefined,
      size: {
        minHeight: layout.size,
      },
      shape: {
        borderRadius: layout.borderRadius,
        padding: {
          vertical: layout.inset,
          horizontal: hasAdditionalHorizontalPadding
            ? layout.horizontalContentPadding
            : layout.inset,
        },
      },
      layout: {
        gap,
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
      },
    },
    stateLayer: {
      backgroundColor: tint,
    },
    text: {
      color: resolved.foreground,
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      fontFamily: textStyle.fontFamily,
      lineHeight: textStyle.lineHeight,
    },
  }
}

export const toThemedPressableThemeResolvers: ComponentThemeResolver<ThemedPressableThemeResolvers> = ({
  themeTokens,
  semanticTokens,
}) => {
  const resolve = (state: ThemedPressableState) => resolveThemedPressableTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
    size: state.size ?? 'md',
    color: state.color,
    coloringStyle: state.coloringStyle ?? 'foreground',
    coloringColorVariant: state.coloringColorVariant ?? 'normal',
    hasAdditionalHorizontalPadding: state.hasAdditionalHorizontalPadding ?? false,
    state: toPressableInteractionState(state),
  })

  return {
    touchTarget: createStyleResolver((state: ThemedPressableState): ThemedPressableStyle => ({
      ...toContainerStyle(resolve(state).touchTarget),
      alignSelf: 'flex-start',
    })),
    visualContainer: createStyleResolver((state: ThemedPressableState): ThemedPressableStyle => ({
      ...toContainerStyle(resolve(state).visualContainer),
      overflow: 'hidden',
    })),
    stateLayer: createStyleResolver((state: ThemedPressableState): ThemedPressableStyle => {
      const tokens = resolve(state)

      return {
        ...toContainerStyle(tokens.stateLayer),
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }
    }),
    text: createStyleResolver((state: ThemedPressableState): ThemedPressableTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
