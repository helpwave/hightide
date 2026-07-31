import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../../theme-tokens/layout'
import { componentSizes } from '../../theme-tokens/layout'

export type HightideAvatarTokens = Record<ComponentSize, {
  size: number,
  padding: number,
  fontSize: number,
  statusDotSize: number,
  statusDotBorderWidth: number,
}>

export const toAvatarTokens = (
  semanticTokens: HightideSemanticTokens
): HightideAvatarTokens => {
  const control = semanticTokens.elementLayout.control

  return Object.fromEntries(
    componentSizes.map((size) => {
      const dimension = control[size].size - semanticTokens.spacing.xs
      let avatarFontSize = Number(semanticTokens.typography.scales.body.large.fontSize)
      if (size === 'xs' || size === 'sm') {
        avatarFontSize = Number(semanticTokens.typography.scales.caption.small.fontSize)
      } else if (size === 'lg' || size === 'xl') {
        avatarFontSize = Number(semanticTokens.typography.scales.title.small.fontSize)
      }

      return [size, {
        size: dimension,
        padding: Math.max(Math.round(control[size].inset / 2), 2),
        fontSize: avatarFontSize,
        statusDotSize: Math.round(dimension / 2),
        statusDotBorderWidth: size === 'xs' ? semanticTokens.borderWidth.thin + 0.5 : semanticTokens.borderWidth.normal,
      }]
    })
  ) as HightideAvatarTokens
}
