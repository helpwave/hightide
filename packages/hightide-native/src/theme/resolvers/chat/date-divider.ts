import type {
  ChatDateDividerStyle,
  ChatDateDividerTextStyle,
  ChatDateDividerThemeResolvers
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

import { StyleAdapterUtils } from '../../adapters'

export const toChatDateDividerThemeResolvers: ComponentThemeResolver<ChatDateDividerThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = () => componentTokens.chat.dateDivider({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    container: createSimpleStyleResolver((): ChatDateDividerStyle => (
      StyleAdapterUtils.container(resolve().container)
    )),
    text: createSimpleStyleResolver((): ChatDateDividerTextStyle => (
      StyleAdapterUtils.text(resolve().text)
    )),
  }
}
