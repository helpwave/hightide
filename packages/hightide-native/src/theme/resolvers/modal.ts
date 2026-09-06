import type {
  ModalBackgroundStyle,
  ModalCloseButtonStyle,
  ModalMenuStyle,
  ModalThemeResolvers
} from '../types/components/modal'
import {
  createSimpleStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

export const toModalThemeResolvers: ComponentThemeResolver<ModalThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = () => componentTokens.modal({
    themeTokens,
    semanticResolvers: semanticTokens,
  })

  return {
    background: createSimpleStyleResolver((): ModalBackgroundStyle => ({
      ...StyleAdapterUtils.container(resolve().background),
      flex: 1,
    })),
    menu: createSimpleStyleResolver((): ModalMenuStyle => (
      StyleAdapterUtils.container(resolve().menu)
    )),
    closeButton: createSimpleStyleResolver((): ModalCloseButtonStyle => (
      StyleAdapterUtils.container(resolve().closeButton)
    )),
  }
}
