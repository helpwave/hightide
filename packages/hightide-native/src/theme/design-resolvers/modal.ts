import {
  modalTokens,
  type ModalTokenResolver,
  type ModalTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../static-resolve/resolve'

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
