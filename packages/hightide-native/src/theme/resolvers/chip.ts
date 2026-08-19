import type {
  ChipIconStyle,
  ChipState,
  ChipStyle,
  ChipTextStyle,
  ChipThemeResolvers
} from '../types/components/chip'
import {
  createStyleResolver,
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

export const toChipThemeResolvers: ComponentThemeResolver<ChipThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: ChipState) => componentTokens.chip({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      size: state.size,
      color: state.color,
      variant: state.variant,
    },
  })

  return {
    chip: createStyleResolver((state: ChipState): ChipStyle => (
      StyleAdapterUtils.container(resolve(state).container)
    )),
    icon: createValueResolver((state: ChipState): ChipIconStyle => (
      StyleAdapterUtils.icon(resolve(state).icon)
    )),
    text: createStyleResolver((state: ChipState): ChipTextStyle => (
      StyleAdapterUtils.text(resolve(state).text)
    )),
  }
}
