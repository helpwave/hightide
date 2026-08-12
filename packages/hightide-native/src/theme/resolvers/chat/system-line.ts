import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import { toContainerStyle, toTextStyle } from '../../adapters/style-adapters'
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
  const resolve = (color?: ColorPairToken) => componentTokens.chat.systemLine({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: { color },
  })

  return {
    container: createStyleResolver((state: ChatSystemLineState): ChatSystemLineStyle => (
      toContainerStyle(resolve(state.color).container)
    )),
    text: createStyleResolver((state: ChatSystemLineState): ChatSystemLineTextStyle => (
      toTextStyle(resolve(state.color).text)
    )),
    icon: createValueResolver((state: ChatSystemLineState): ChatSystemLineIconStyle => ({
      color: resolve(state.color).icon.color,
    })),
  }
}
