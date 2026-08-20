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

import { StyleAdapterUtils } from '../../adapters'

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
      StyleAdapterUtils.container(resolve(state.color).container)
    )),
    text: createStyleResolver((state: ChatSystemLineState): ChatSystemLineTextStyle => (
      StyleAdapterUtils.text(resolve(state.color).text)
    )),
    icon: createValueResolver((state: ChatSystemLineState): ChatSystemLineIconStyle => (
      StyleAdapterUtils.icon(resolve(state.color).icon)
    )),
  }
}
