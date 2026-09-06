import {
  chatThreadHeaderTokens,
  type ChatThreadHeaderTokenResolver,
  type ChatThreadHeaderTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../../static-resolve/resolve'

export const chatThreadHeaderTokenResolver: ChatThreadHeaderTokenResolver = ({
  themeTokens,
}) => (
  resolveTokenConfig<ChatThreadHeaderTokens>(
    chatThreadHeaderTokens,
    new Set(),
    {
      theme: themeTokens,
    }
  )
)
