import type { ComponentTokenResolver } from '../component-token-resolver'
import type {
  PressableComponentResolverProps,
  PressableTokens
} from '../pressable-tokens'
import {
  pillBorderRadius,
  surfaceDescriptionColor,
  surfaceFadedColor
} from './shared'
import {
  stateful,
  tokenPath,
  tokenValue,
  whenState
} from '../builders'

export type ChatQuickReplyChipComponentResolverProps = {
  config: {
    isActive?: boolean,
  },
}

export type ChatQuickReplyChipTokens = {
  config: Partial<PressableComponentResolverProps['overrides']>,
} & Partial<PressableTokens>

export type ChatQuickReplyChipTokenResolver = ComponentTokenResolver<
  ChatQuickReplyChipComponentResolverProps,
  ChatQuickReplyChipTokens
>

export const chatQuickReplyChipTokens = {
  config: {
    coloringStyle: 'filled',
    coloringColorVariant: 'normal',
    size: 'sm',
  },
  container: {
    borderRadius: stateful({
      type: 'all',
      value: tokenValue(pillBorderRadius),
    }),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('theme.padding.md'),
      horizontal: tokenPath('theme.padding.lg'),
    }),
    border: stateful({
      width: {
        type: 'all',
        value: tokenPath('theme.borderWidth.thin'),
      },
      color: {
        type: 'all',
        value: surfaceFadedColor,
      },
    }, [
      whenState(['active'], {
        width: {
          type: 'all',
          value: tokenPath('theme.borderWidth.thin'),
        },
        color: {
          type: 'all',
          value: tokenPath('theme.color.primary.color'),
        },
      }),
    ]),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: tokenPath('theme.padding.md'),
    }),
  },
  stateLayer: {
    borderRadius: stateful({
      type: 'all',
      value: tokenValue(pillBorderRadius),
    }),
  },
  text: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.medium')),
    color: stateful(
      surfaceDescriptionColor,
      [
        whenState(['active'], tokenPath('theme.color.primary.color')),
      ]
    ),
  },
} as const
