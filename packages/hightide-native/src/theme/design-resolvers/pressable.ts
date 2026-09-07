import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import {
  pressableTokens,
  toButtonIconSize,
  tokenVariable,
  type PressableButtonTokenParams,
  type PressableStateValue,
  type PressableTokenResolver,
  type PressableTokens
} from '@helpwave/hightide-design/component-tokens'
import {
  semanticTokens,
  toTypographySize
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveResolvableValue, resolveTokenConfig, type TokenResolveContext } from '../static-resolve/resolve'
import { resolvePressableStateLayerTint } from './semantic'
import { iconTokenResolver } from './icon'

type PressableTokenState = PressableStateValue | 'outlined' | 'additionalHorizontalPadding'

type PressableParams = Pick<
  PressableButtonTokenParams,
  'layout' | 'tint' | 'textStyle' | 'iconSize' | 'iconStrokeWidth' | 'gap' | 'colorPair'
>

export const pressableTokenResolver: PressableTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const coloringStyle = overrides.coloringStyle ?? 'foreground'
  const coloringColorVariant = overrides.coloringColorVariant ?? 'normal'
  const hasAdditionalHorizontalPadding = overrides.hasAdditionalHorizontalPadding ?? false
  const colorPair = overrides.color ?? (
    coloringStyle === 'filled'
      ? themeTokens.color.surface
      : {
        color: themeTokens.color.surface.onColor,
        onColor: themeTokens.color.surface.color,
      }
  )
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const textStyle = themeTokens.typography.label[toTypographySize(size)]
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size: toButtonIconSize(size) },
  })
  const states = new Set<PressableTokenState>(state)
  const params: PressableParams = {
    layout,
    tint: HexColorUtils.transparent,
    textStyle,
    iconSize: iconSizeTokens.size ?? themeTokens.icongraphy.sizes.md,
    iconStrokeWidth: iconSizeTokens.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
    gap: themeTokens.spacing[size],
    colorPair,
  }
  const context: TokenResolveContext = {
    theme: themeTokens,
    semantics: semanticTokens,
    params,
    config: {
      coloringColorVariant,
      coloringStyle,
    },
    state: states,
  }

  const outline = resolveResolvableValue(
    tokenVariable('semantics.pressableColoring.outline'),
    context
  ) as ColorToken

  if (outline !== HexColorUtils.transparent) {
    states.add('outlined')
  }

  if (hasAdditionalHorizontalPadding) {
    states.add('additionalHorizontalPadding')
  }

  const foreground = resolveResolvableValue(
    tokenVariable('semantics.coloringStyle.foreground'),
    context
  ) as ColorToken
  params.tint = resolvePressableStateLayerTint({
    themeTokens,
    states: state,
    color: foreground,
  })

  return resolveTokenConfig<PressableTokens>(
    pressableTokens,
    states,
    context
  )
}
