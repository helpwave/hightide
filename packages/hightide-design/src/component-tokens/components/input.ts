import type { ColorToken } from '../../primitive-tokens/color'
import type { HightideTypographyStyleToken } from '../../semantic-tokens/typography'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'

export type InputLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  gap: number,
  horizontalInset: number,
  minWidth: number,
  textStyle: HightideTypographyStyleToken,
}

export type HightideInputTokens = InputLayoutToken & {
  background: ColorToken,
  text: ColorToken,
}

export const toInputTokens = (
  semanticTokens: HightideSemanticTokens
): HightideInputTokens => {
  const inputControl = semanticTokens.elementLayout.control.md

  return {
    size: inputControl.size,
    inset: semanticTokens.spacing.sm,
    borderWidth: semanticTokens.borderWidth.thin,
    borderRadius: inputControl.borderRadius,
    gap: semanticTokens.spacing.sm,
    horizontalInset: semanticTokens.spacing.md,
    minWidth: inputControl.minimumWidth ?? inputControl.size,
    textStyle: semanticTokens.typography.label.md,
    background: semanticTokens.colors.surfaceVariant,
    text: semanticTokens.colors.onSurface,
  }
}
