import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import { toContainerStyle } from '../../adapters/container-adapter'
import { toIconStyle } from '../../adapters/icon-style-adapter'
import { toTextStyle } from '../../adapters/text-style-adapter'
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
    icon: createValueResolver((state: ChatSystemLineState): ChatSystemLineIconStyle => (
      toIconStyle(resolve(state.color).icon)
    )),
  }
}
