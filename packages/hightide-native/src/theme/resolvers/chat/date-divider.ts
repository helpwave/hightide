import type {
  ChatDateDividerStyle,
  ChatDateDividerTextStyle,
  ChatDateDividerThemeResolvers
} from '../../types/components/chat'
import {
  createSimpleStyleResolver,
  type ComponentThemeResolver
} from '../../types/resolver'

export const toChatDateDividerThemeResolvers: ComponentThemeResolver<ChatDateDividerThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = () => componentTokens({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    container: createSimpleStyleResolver((): ChatDateDividerStyle => ({
      ...resolve().container,
    })),
    text: createSimpleStyleResolver((): ChatDateDividerTextStyle => ({
      ...resolve().text,
    })),
  }
}
