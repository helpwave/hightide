import type { ColorToken } from '../../primitive-tokens/color'
import type { HightideTypographyStyleToken } from '../../semantic-tokens/typography'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../componentSize'

export const avatarStatus = [
  'online',
  'offline',
  'busy',
  'away',
  'unknown',
] as const

export type AvatarStatus = typeof avatarStatus[number]

export type AvatarContainerTokens = {
  size: number,
  padding: number,
  borderRadius: number,
  color: ColorToken,
}

export type AvatarTextTokens = {
  textStyle: HightideTypographyStyleToken,
  color: ColorToken,
}

export type AvatarStatusDotTokens = {
  size: number,
  borderWidth: number,
  borderRadius: number,
  color: Record<AvatarStatus, ColorToken>,
}

export type AvatarSizeTokens = {
  container: AvatarContainerTokens,
  text: AvatarTextTokens,
  statusDot: AvatarStatusDotTokens,
}

export type HightideAvatarTokens = Record<ComponentSize, AvatarSizeTokens>

const avatarSizes = ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[]

export const toAvatarTokens = (
  semanticTokens: HightideSemanticTokens
): HightideAvatarTokens => {
  const insideControl = semanticTokens.elementLayout.insideControl
  const bold = semanticTokens.typography.fontWeights.bold
  const { colorSchemes, colors, borderWidth } = semanticTokens
  const primaryFilled = colorSchemes.primary.filled.base

  const statusDotColor: Record<AvatarStatus, ColorToken> = {
    online: colorSchemes.positive.filled.base.color,
    busy: colorSchemes.negative.filled.base.color,
    away: colorSchemes.warning.filled.base.color,
    offline: colors.disabled,
    unknown: colors.disabled,
  }

  return Object.fromEntries(
    avatarSizes.map((size) => {
      const layout = insideControl[size]
      const dimension = layout.size
      const label = semanticTokens.typography.label[size]
      const statusDotSize = Math.round(dimension / 10 * 4)

      return [size, {
        container: {
          size: dimension,
          padding: layout.inset,
          borderRadius: dimension / 2,
          color: primaryFilled.color,
        },
        text: {
          textStyle: {
            ...label,
            fontWeight: bold,
          },
          color: primaryFilled.foreground,
        },
        statusDot: {
          size: statusDotSize,
          borderWidth: borderWidth.thin,
          borderRadius: statusDotSize / 2,
          color: statusDotColor,
        },
      } satisfies AvatarSizeTokens]
    })
  ) as HightideAvatarTokens
}
