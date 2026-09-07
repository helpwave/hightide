import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import {
  buttonTokens,
  toButtonIconSize,
  tokenVariable,
  type ButtonTokenResolver,
  type ButtonTokens,
  type PressableButtonTokenParams,
  type PressableStateValue
} from '@helpwave/hightide-design/component-tokens'
import {
  semanticTokens,
  toTypographySize,
  type ButtonVariant
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveResolvableValue, resolveTokenConfig, type TokenResolveContext } from '../static-resolve/resolve'
import {
  mapButtonVariant,
  resolvePressableStateLayerTint
} from './semantic'
import { iconTokenResolver } from './icon'

type ButtonTokenState = PressableStateValue | ButtonVariant

type ButtonParams = Pick<
  PressableButtonTokenParams,
  'layout' | 'tint' | 'textStyle' | 'iconSize' | 'iconStrokeWidth' | 'gap' | 'colorPair'
>

export const buttonTokenResolver: ButtonTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const variant = overrides.variant ?? 'filled'
  const { colorVariant, style } = mapButtonVariant(variant)
  const colorPair = overrides.color ?? themeTokens.color.primary
  const layout = semanticResolvers.controlLayout({
    themeTokens,
    size,
  })
  const textStyle = themeTokens.typography.label[toTypographySize(size)]
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      size: toButtonIconSize(size),
    },
  })
  const states = new Set<ButtonTokenState>([...state, variant])
  const params: ButtonParams = {
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
      coloringColorVariant: colorVariant,
      coloringStyle: style,
    },
    state: states,
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

  return resolveTokenConfig<ButtonTokens>(
    buttonTokens,
    states,
    context
  )
}
