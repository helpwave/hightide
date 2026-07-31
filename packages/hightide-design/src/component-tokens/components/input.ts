import type { ColorToken } from '../../primitive-tokens/color'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'

export type InputLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  gap: number,
  horizontalInset: number,
  minWidth: number,
  fontSize: number,
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
    fontSize: Number(semanticTokens.typography.scales.label.medium.fontSize),
    background: semanticTokens.colors.surfaceVariant,
    text: semanticTokens.colors.onSurface,
  }
}
