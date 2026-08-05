import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type {
  ChatSystemLineIconStyle,
  ChatSystemLineState,
  ChatSystemLineStyle,
  ChatSystemLineTextStyle,
  ChatSystemLineThemeResolvers
} from '../../types/components/chat'
import {
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatSystemLineThemeResolvers: ComponentThemeResolver<ChatSystemLineThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (color?: ColorPairToken) => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: { color },
  })

  return {
    container: createStyleResolver((state: ChatSystemLineState): ChatSystemLineStyle => ({
      ...resolve(state.color).container,
    })),
    text: createStyleResolver((state: ChatSystemLineState): ChatSystemLineTextStyle => ({
      ...resolve(state.color).text,
    })),
    icon: createValueResolver((state: ChatSystemLineState): ChatSystemLineIconStyle => ({
      color: resolve(state.color).icon.color,
    })),
  }
}
