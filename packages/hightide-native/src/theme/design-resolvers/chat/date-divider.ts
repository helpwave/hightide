import {
  chatDateDividerTokens,
  type ChatDateDividerTokenResolver,
  type ChatDateDividerTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../../static-resolve/resolve'

export const chatDateDividerTokenResolver: ChatDateDividerTokenResolver = ({
  themeTokens,
}) => (
  resolveTokenConfig<ChatDateDividerTokens>(
    chatDateDividerTokens,
    new Set(),
    {
      theme: themeTokens,
    }
  )
)
