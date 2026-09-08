import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type {
  PressableComponentResolverProps,
  PressableTokens
} from '../pressable-tokens'
import type { ComponentTokenConfig } from '../token-config'
import {
  pillBorderRadius,
  surfaceDescriptionColor,
  surfaceFadedColor
} from './shared'
import {
  stateful,
  tokenVariable,
  tokenValue,
  whenState,
  statefulField
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
      vertical: tokenVariable('theme.padding.md'),
      horizontal: tokenVariable('theme.padding.lg'),
    }),
    border: statefulField<NonNullable<ContainerTokens['border']>>({
      width: {
        type: 'all',
        value: tokenVariable('theme.borderWidth.thin'),
      },
      color: {
        type: 'all',
        value: surfaceFadedColor,
      },
    }, [
      whenState(['active'], {
        width: {
          type: 'all',
          value: tokenVariable('theme.borderWidth.thin'),
        },
        color: {
          type: 'all',
          value: tokenVariable('theme.color.primary.color'),
        },
      }),
    ]),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: tokenVariable('theme.padding.md'),
    }),
  },
  stateLayer: {
    borderRadius: stateful({
      type: 'all',
      value: tokenValue(pillBorderRadius),
    }),
  },
  text: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.medium')),
    color: statefulField<ColorToken>(
      surfaceDescriptionColor,
      [
        whenState(['active'], tokenVariable('theme.color.primary.color')),
      ]
    ),
  },
} as const satisfies ComponentTokenConfig<ChatQuickReplyChipTokens>
