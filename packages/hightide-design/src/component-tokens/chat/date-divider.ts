import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  pillBorderRadius,
  surfaceDescriptionColor
} from './shared'
import {
  stateful,
  tokenPath,
  tokenValue
} from '../builders'

export type ChatDateDividerTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
}

export type ChatDateDividerTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatDateDividerTokens
>

export const chatDateDividerTokens = {
  container: {
    backgroundColor: stateful(tokenPath('theme.color.surface.color')),
    borderRadius: stateful({
      type: 'all',
      value: tokenValue(pillBorderRadius),
    }),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('theme.spacing.sm'),
      horizontal: tokenPath('theme.spacing.lg'),
    }),
    layout: stateful({
      selfCrossAxisAlignment: 'center',
    }),
  },
  text: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.medium')),
    color: stateful(surfaceDescriptionColor),
  },
} as const
