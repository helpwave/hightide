import type { ColorToken } from '../primitive-tokens/color'
import { createElementLayoutTokens } from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { TextStyleTokens } from './text-style-tokens'

export type InputState = {
  isDisabled?: boolean,
  isFocused?: boolean,
  isInvalid?: boolean,
  isReadOnly?: boolean,
}

export type InputComponentResolverProps = {
  state: InputState,
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
  InputComponentResolverProps,
  InputThemeTokens
> = ({ themeTokens, semanticResolvers, state }) => {
  const { color, spacing, borders, typography } = themeTokens
  const layout = createElementLayoutTokens(themeTokens).control.md
  const textStyle = typography.label.md
  const onColor = color.surface.onColor
  const borderColor = semanticResolvers.asFaded({
    themeTokens,
    semanticResolvers,
    color: onColor,
  })
  const placeholderColor = semanticResolvers.asDescription({
    themeTokens,
    semanticResolvers,
    color: onColor,
  })

  return {
    input: {
      ...textStyle,
      minHeight: layout.size,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: layout.borderRadius,
      borderWidth: borders.borderWidths.thin,
      borderColor: state.isInvalid ? color.negative.color : borderColor,
      backgroundColor: state.isDisabled ? color.disabled.color : color.surfaceVariant.color,
      color: state.isDisabled ? color.disabled.onColor : onColor,
      opacity: state.isDisabled ? 0.6 : 1,
    },
    placeholderColor,
  }
}
