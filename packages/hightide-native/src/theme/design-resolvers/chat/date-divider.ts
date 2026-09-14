import {
  chatDateDividerTokens,
  type ChatDateDividerTokenResolver,
  type ChatDateDividerTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'

export const chatDateDividerTokenResolver: ChatDateDividerTokenResolver = ({
  themeTokens,
}) => (
  resolveConfigNode<ChatDateDividerTokens>(
    chatDateDividerTokens,
    {
      theme: themeTokens,
      state: new Set(),
    }
  )
)
