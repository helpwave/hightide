import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  resolveAccentColoring,
  type ChatIconTokens
} from './shared'

export type ChatSystemLineComponentResolverProps = {
  overrides: {
    color?: ColorPairToken,
  },
}

export type ChatSystemLineTokens = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: number,
  },
  text: TextStyleTokens,
  icon: ChatIconTokens,
}

export type ChatSystemLineTokenResolver = ComponentTokenResolver<
  ChatSystemLineComponentResolverProps,
  ChatSystemLineTokens
>

export const chatSystemLineTokenResolver: ChatSystemLineTokenResolver = ({ themeTokens, overrides }) => {
  const { shape, typography } = themeTokens
  const { accentText } = resolveAccentColoring({
    themeTokens,
    color: overrides.color,
  })

  return {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      gap: shape.padding.md,
    },
    text: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: accentText.onColor,
    },
    icon: {
      color: accentText.onColor,
    },
  }
}
