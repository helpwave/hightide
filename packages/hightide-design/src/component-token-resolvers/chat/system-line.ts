import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import { resolveAccentColoring } from './shared'

export type ChatSystemLineComponentResolverProps = {
  overrides: {
    color?: ColorPairToken,
  },
}

export type ChatSystemLineTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
  icon: IconTokens,
}

export type ChatSystemLineTokenResolver = ComponentTokenResolver<
  ChatSystemLineComponentResolverProps,
  ChatSystemLineTokens
>

export const chatSystemLineTokenResolver: ChatSystemLineTokenResolver = ({ themeTokens, overrides }) => {
  const { padding, typography, fontWeights } = themeTokens
  const { accentText } = resolveAccentColoring({
    themeTokens,
    color: overrides.color,
  })

  return {
    container: {
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'center',
        selfCrossAxisAlignment: 'center',
        gap: padding.md,
      },
    },
    text: {
      ...typography.body.sm,
      fontWeight: fontWeights.medium,
      color: accentText.foreground,
    },
    icon: {
      color: accentText.foreground,
    },
  }
}
