import type { HightideTypographyStyleToken } from '../../semantic-tokens/typography'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../componentSize'

export type HightideAvatarTokens = Record<ComponentSize, {
  size: number,
  padding: number,
  textStyle: HightideTypographyStyleToken,
  statusDotSize: number,
  statusDotBorderWidth: number,
}>

const avatarSizes = ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[]

export const toAvatarTokens = (
  semanticTokens: HightideSemanticTokens
): HightideAvatarTokens => {
  const control = semanticTokens.elementLayout.control
  const insideControl = semanticTokens.elementLayout.insideControl
  const bold = semanticTokens.typography.fontWeights.bold

  return Object.fromEntries(
    avatarSizes.map((size) => {
      const dimension = insideControl[size].size
      const label = semanticTokens.typography.label[size]

      return [size, {
        size: dimension,
        padding: Math.max(Math.round(control[size].inset / 2), 2),
        textStyle: {
          ...label,
          fontWeight: bold,
        },
        statusDotSize: Math.round(dimension / 2),
        statusDotBorderWidth: size === 'sm'
          ? semanticTokens.borderWidth.thin + 0.5
          : semanticTokens.borderWidth.normal,
      }]
    })
  ) as HightideAvatarTokens
}
