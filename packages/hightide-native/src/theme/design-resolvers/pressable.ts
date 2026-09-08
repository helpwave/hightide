import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import {
  pressableTokens,
  tokenVariable,
  type PressableButtonTokenParams,
  type PressableStateValue,
  type PressableTokenResolver,
  type PressableTokens
} from '@helpwave/hightide-design/component-tokens'
import {
  semanticTokens,
  type PressableTokenConfig
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveResolvableValue, resolveTokenConfig, type TokenResolveContext } from '../static-resolve/resolve'

type PressableTokenState = PressableStateValue | 'outlined' | 'additionalHorizontalPadding'

type PressableParams = Pick<PressableButtonTokenParams, 'colorPair'>

export const pressableTokenResolver: PressableTokenResolver = ({
  themeTokens,
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
  const states = new Set<PressableTokenState>(state)
  const params: PressableParams = {
    colorPair,
  }
  const config: PressableTokenConfig = {
    coloringStyle,
    coloringColorVariant,
    size,
  }
  const context: TokenResolveContext = {
    theme: themeTokens,
    semantics: semanticTokens,
    params,
    config,
    state: states,
  }

  const outline = resolveResolvableValue(
    tokenVariable('semantics.coloring.outline'),
    context
  ) as ColorToken

  if (outline !== HexColorUtils.transparent) {
    states.add('outlined')
  }

  if (hasAdditionalHorizontalPadding) {
    states.add('additionalHorizontalPadding')
  }

  return resolveTokenConfig<PressableTokens>(
    pressableTokens,
    states,
    context
  )
}
