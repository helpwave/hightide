import { toContainerStyle } from '../adapters/container-adapter'
import { toIconStyle } from '../adapters/icon-style-adapter'
import { toTextStyle } from '../adapters/text-style-adapter'
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
      toContainerStyle(resolve(state).container)
    )),
    icon: createValueResolver((state: ChipState): ChipIconStyle => (
      toIconStyle(resolve(state).icon)
    )),
    text: createStyleResolver((state: ChipState): ChipTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
