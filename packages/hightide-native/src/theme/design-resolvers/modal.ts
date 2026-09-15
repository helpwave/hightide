import {
  modalTokens,
  type ModalTokenResolver,
  type ModalTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '@helpwave/hightide-design/component-tokens'

export const modalTokenResolver: ModalTokenResolver = ({
  themeTokens,
}) => (
  resolveConfigNode<ModalTokens>(
    modalTokens,
    {
      theme: themeTokens,
      state: new Set(),
    }
  )
)
