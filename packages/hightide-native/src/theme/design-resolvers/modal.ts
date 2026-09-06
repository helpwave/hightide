import {
  modalTokens,
  type ModalTokenResolver,
  type ModalTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'

export const modalTokenResolver: ModalTokenResolver = ({
  themeTokens,
}) => (
  resolveTokenConfig<ModalTokens>(
    modalTokens,
    new Set(),
    {
      theme: themeTokens,
    }
  )
)
