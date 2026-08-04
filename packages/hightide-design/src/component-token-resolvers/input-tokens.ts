import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { createElementLayoutTokens } from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { TextStyleTokens } from './text-style-tokens'

export type InputState = {
  isDisabled?: boolean,
  isFocused?: boolean,
  isInvalid?: boolean,
  isReadOnly?: boolean,
}

export type InputContainerTokens = TextStyleTokens & {
  minHeight: number,
  paddingVertical: number,
  paddingHorizontal: number,
  borderRadius: number,
  borderWidth: number,
  borderColor: ColorToken,
  backgroundColor: ColorToken,
  opacity: number,
}

export type InputThemeTokens = {
  input: InputContainerTokens,
  placeholderColor: ColorToken,
}

export const hightideInputTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  InputState,
  InputThemeTokens
> = ({ themeTokens, state }) => {
  const { color, spacing, borders, typography } = themeTokens
  const layout = createElementLayoutTokens(themeTokens).control.md
  const textStyle = typography.label.md

  return {
    input: {
      ...textStyle,
      minHeight: layout.size,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: layout.borderRadius,
      borderWidth: borders.borderWidths.thin,
      borderColor: state.isInvalid ? color.negative.color : color.border,
      backgroundColor: state.isDisabled ? color.disabled : color.surfaceVariant,
      color: state.isDisabled ? color.onDisabled : color.onSurface,
      opacity: state.isDisabled ? 0.6 : 1,
    },
    placeholderColor: color.placeholder,
  }
}
