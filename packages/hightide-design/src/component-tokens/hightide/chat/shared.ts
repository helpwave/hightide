import { TokenBuilder } from '../../../utils'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export const pillBorderRadius = 999
export const bubbleMaxWidth = 280

export const surfaceDescriptionColor = TokenBuilder.colorBlend(
  TokenBuilder.colorRef('theme.color.surface.color'),
  TokenBuilder.colorOpacity(
    TokenBuilder.colorRef('theme.color.surface.onColor'),
    TokenBuilder.numberRef('theme.config.appearancePercentages.subtle')
  )
)

export const surfaceFadedColor = TokenBuilder.colorBlend(
  TokenBuilder.colorRef('theme.color.surface.color'),
  TokenBuilder.colorOpacity(
    TokenBuilder.colorRef('theme.color.surface.onColor'),
    TokenBuilder.numberRef('theme.config.appearancePercentages.faded')
  )
)

export const messageCornersTokens = TokenBuilder.borderRadius(
  {
    topLeft: TokenBuilder.numberRef('theme.borderRadius.lg'),
    topRight: TokenBuilder.numberRef('theme.borderRadius.lg'),
    bottomLeft: TokenBuilder.numberRef('theme.borderRadius.xxs'),
    bottomRight: TokenBuilder.numberRef('theme.borderRadius.lg'),
  },
  [
    TokenBuilder.whenState(['outgoing'], TokenBuilder.corners({
      topLeft: TokenBuilder.numberRef('theme.borderRadius.lg'),
      topRight: TokenBuilder.numberRef('theme.borderRadius.lg'),
      bottomLeft: TokenBuilder.numberRef('theme.borderRadius.lg'),
      bottomRight: TokenBuilder.numberRef('theme.borderRadius.xxs'),
    })),
  ]
)
