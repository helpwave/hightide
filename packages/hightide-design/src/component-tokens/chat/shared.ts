import {
  tokenColorBlend,
  tokenColorOpacity,
  tokenVariable,
  whenState,
  statefulField
} from '../builders'
import type { ContainerTokens } from '../container-tokens'

export type ChatMessageDirection = 'incoming' | 'outgoing'

export const pillBorderRadius = 999
export const bubbleMaxWidth = 280

export const surfaceDescriptionColor = tokenColorBlend(
  tokenVariable('theme.color.surface.color'),
  tokenColorOpacity(
    tokenVariable('theme.color.surface.onColor'),
    tokenVariable('theme.config.appearancePercentages.subtle')
  )
)

export const surfaceFadedColor = tokenColorBlend(
  tokenVariable('theme.color.surface.color'),
  tokenColorOpacity(
    tokenVariable('theme.color.surface.onColor'),
    tokenVariable('theme.config.appearancePercentages.faded')
  )
)

export const messageCornersTokens = statefulField<NonNullable<ContainerTokens['borderRadius']>>({
  type: 'physicalCorner',
  topLeft: tokenVariable('theme.borderRadius.lg'),
  topRight: tokenVariable('theme.borderRadius.lg'),
  bottomLeft: tokenVariable('theme.borderRadius.xxs'),
  bottomRight: tokenVariable('theme.borderRadius.lg'),
}, [
  whenState(['outgoing'], {
    type: 'physicalCorner',
    topLeft: tokenVariable('theme.borderRadius.lg'),
    topRight: tokenVariable('theme.borderRadius.lg'),
    bottomLeft: tokenVariable('theme.borderRadius.lg'),
    bottomRight: tokenVariable('theme.borderRadius.xxs'),
  }),
])
