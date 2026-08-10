import { toContainerStyle, toTextStyle } from '../adapters/style-adapters'
import type {
  ChipState,
  ChipStyle,
  ChipTextStyle,
  ChipThemeResolvers
} from '../types/components/chip'
import {
  createStyleResolver,
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
    text: createStyleResolver((state: ChipState): ChipTextStyle => (
      toTextStyle(resolve(state).text)
    )),
  }
}
