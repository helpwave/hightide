import type {
  DividerState,
  DividerStyle,
  DividerThemeResolvers
} from '../types/components/divider'
import {
  createStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

export const toDividerThemeResolvers: ComponentThemeResolver<DividerThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: DividerState = {}) => componentTokens.divider({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      direction: state.direction,
      color: state.color,
      width: state.width,
      margin: state.margin,
    },
  })

  return {
    container: createStyleResolver((state: DividerState): DividerStyle => ({
      ...StyleAdapterUtils.container(resolve(state)),
    })),
  }
}
