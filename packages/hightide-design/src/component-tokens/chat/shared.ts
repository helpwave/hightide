import {
  stateful,
  tokenColorBlend,
  tokenColorOpacity,
  tokenPath,
  whenState
} from '../builders'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export const pillBorderRadius = 999
export const bubbleMaxWidth = 280

export const surfaceDescriptionColor = tokenColorBlend(
  tokenPath('theme.color.surface.color'),
  tokenColorOpacity(
    tokenPath('theme.color.surface.onColor'),
    tokenPath('theme.config.appearancePercentages.subtle')
  )
)

export const surfaceFadedColor = tokenColorBlend(
  tokenPath('theme.color.surface.color'),
  tokenColorOpacity(
    tokenPath('theme.color.surface.onColor'),
    tokenPath('theme.config.appearancePercentages.faded')
  )
)

export const messageCornersTokens = stateful({
  type: 'physicalCorner',
  topLeft: tokenPath('theme.borderRadius.lg'),
  topRight: tokenPath('theme.borderRadius.lg'),
  bottomLeft: tokenPath('theme.borderRadius.xxs'),
  bottomRight: tokenPath('theme.borderRadius.lg'),
}, [
  whenState(['outgoing'], {
    type: 'physicalCorner',
    topLeft: tokenPath('theme.borderRadius.lg'),
    topRight: tokenPath('theme.borderRadius.lg'),
    bottomLeft: tokenPath('theme.borderRadius.lg'),
    bottomRight: tokenPath('theme.borderRadius.xxs'),
  }),
])
