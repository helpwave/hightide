import {
  chatDateDividerTokens,
  type ChatDateDividerTokenResolver,
  type ChatDateDividerTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../../static-resolve/resolve'

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
