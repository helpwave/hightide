import type { InputThemeResolvers } from '../types/components/input'
import type { ComponentThemeResolver } from '../types/resolver'

import { toInputThemeResolvers } from './input'

export const toTextareaThemeResolvers: ComponentThemeResolver<InputThemeResolvers> = (params) => (
  toInputThemeResolvers({
    ...params,
    componentTokens: {
      ...params.componentTokens,
      input: params.componentTokens.textarea,
    },
  })
)
