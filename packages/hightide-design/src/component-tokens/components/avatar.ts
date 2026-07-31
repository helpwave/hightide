import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../componentSize'

export type HightideAvatarTokens = Record<ComponentSize, {
  size: number,
  padding: number,
  fontSize: number,
  statusDotSize: number,
  statusDotBorderWidth: number,
}>

const avatarSizes = ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[]

export const toAvatarTokens = (
  semanticTokens: HightideSemanticTokens
): HightideAvatarTokens => {
  const control = semanticTokens.elementLayout.control
  const insideControl = semanticTokens.elementLayout.insideControl

  return Object.fromEntries(
    avatarSizes.map((size) => {
      const dimension = insideControl[size].size
      let avatarFontSize = Number(semanticTokens.typography.scales.body.large.fontSize)
      if (size === 'sm') {
        avatarFontSize = Number(semanticTokens.typography.scales.caption.small.fontSize)
      } else if (size === 'lg') {
        avatarFontSize = Number(semanticTokens.typography.scales.title.small.fontSize)
      }

      return [size, {
        size: dimension,
        padding: Math.max(Math.round(control[size].inset / 2), 2),
        fontSize: avatarFontSize,
        statusDotSize: Math.round(dimension / 2),
        statusDotBorderWidth: size === 'sm'
          ? semanticTokens.borderWidth.thin + 0.5
          : semanticTokens.borderWidth.normal,
      }]
    })
  ) as HightideAvatarTokens
}
