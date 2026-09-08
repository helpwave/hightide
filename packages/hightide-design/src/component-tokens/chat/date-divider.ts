import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import type { ComponentTokenConfig } from '../token-config'
import {
  pillBorderRadius,
  surfaceDescriptionColor
} from './shared'
import {
  stateful,
  tokenVariable,
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
    backgroundColor: stateful(tokenVariable('theme.color.surface.color')),
    borderRadius: stateful({
      type: 'all',
      value: tokenValue(pillBorderRadius),
    }),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenVariable('theme.spacing.sm'),
      horizontal: tokenVariable('theme.spacing.lg'),
    }),
    layout: stateful({
      selfCrossAxisAlignment: 'center',
    }),
  },
  text: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.medium')),
    color: stateful(surfaceDescriptionColor),
  },
} as const satisfies ComponentTokenConfig<ChatDateDividerTokens>
