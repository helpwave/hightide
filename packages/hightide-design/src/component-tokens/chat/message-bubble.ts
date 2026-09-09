import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import { elevationTokens } from '../elevation-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  messageCornersTokens,
  type ChatMessageDirection
} from './shared'
import {
  stateful,
  tokenCalc,
  tokenColorBlend,
  tokenColorOpacity,
  tokenVariable,
  tokenValue,
  whenState,
  statefulField
} from '../builders'
import type { ComponentTokenConfigValue, ComponentTokenConfig } from '../token-config'

export type ChatMessageBubbleComponentResolverProps = {
  config: {
    direction?: ChatMessageDirection,
  },
}

export type ChatMessageBubbleTokens = {
  container: ContainerTokens,
  body: ContainerTokens,
  bodyText: TextStyleTokens,
  metaDataContainer: ContainerTokens,
  metaDataStatusContainer: ContainerTokens,
  metaDataText: TextStyleTokens,
  metaDataIcon: IconTokens,
}

export type ChatMessageBubbleTokenResolver = ComponentTokenResolver<
  ChatMessageBubbleComponentResolverProps,
  ChatMessageBubbleTokens
>

const bubbleMaxWidth = tokenCalc(
  'multiply',
  tokenVariable('theme.size.md'),
  tokenValue(16)
)

const outgoingDescription = tokenColorBlend(
  tokenVariable('theme.color.primary.color'),
  tokenColorOpacity(
    tokenVariable('theme.color.primary.onColor'),
    tokenVariable('theme.config.appearancePercentages.subtle')
  )
)

const incomingDescription = tokenColorBlend(
  tokenVariable('theme.color.surface.color'),
  tokenColorOpacity(
    tokenVariable('theme.color.surface.onColor'),
    tokenVariable('theme.config.appearancePercentages.subtle')
  )
)

export const chatMessageBubbleTokens = {
  container: {
    backgroundColor: statefulField<ColorToken>(
      tokenVariable('theme.color.surface.color'),
      [
        whenState(['outgoing'], tokenVariable('theme.color.primary.color')),
      ]
    ),
    size: stateful({
      maxWidth: bubbleMaxWidth,
    }),
    borderRadius: messageCornersTokens,
    padding: stateful({
      type: 'physicalSide',
      left: tokenVariable('theme.padding.xl'),
      right: tokenVariable('theme.padding.xl'),
      top: tokenVariable('theme.padding.lg'),
      bottom: tokenVariable('theme.padding.md'),
    }),
    margin: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['margin']>>>({
      type: 'logicalSide',
      inlineEnd: tokenVariable('theme.spacing.xxl'),
    }, [
      whenState(['outgoing'], {
        type: 'logicalSide',
        inlineStart: tokenVariable('theme.spacing.xxl'),
      }),
    ]),
    layout: stateful({
      gap: tokenVariable('theme.spacing.sm'),
      direction: 'vertical',
      selfCrossAxisAlignment: 'start',
    }, [
      whenState(['outgoing'], {
        gap: tokenVariable('theme.spacing.sm'),
        direction: 'vertical',
        selfCrossAxisAlignment: 'end',
      }),
    ]),
    shadow: stateful(elevationTokens('level1')),
  },
  body: {
    layout: stateful({
      direction: 'vertical',
    }),
  },
  bodyText: {
    fontSize: stateful(tokenVariable('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.light')),
    color: statefulField<ColorToken>(
      tokenVariable('theme.color.surface.onColor'),
      [
        whenState(['outgoing'], tokenVariable('theme.color.primary.onColor')),
      ]
    ),
  },
  metaDataContainer: {
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'end',
      crossAxisAlignment: 'center',
      gap: tokenVariable('theme.spacing.md'),
      selfCrossAxisAlignment: 'end',
    }),
  },
  metaDataStatusContainer: {
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: tokenVariable('theme.spacing.xs'),
    }),
  },
  metaDataText: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.medium')),
    color: statefulField<ColorToken>(incomingDescription, [
      whenState(['outgoing'], outgoingDescription),
    ]),
  },
  metaDataIcon: {
    size: stateful(tokenVariable('theme.icongraphy.sizes.xs')),
    strokeWidth: stateful(tokenVariable('theme.icongraphy.strokeWidth')),
    color: statefulField<ColorToken>(incomingDescription, [
      whenState(['outgoing'], outgoingDescription),
    ]),
  },
} as const satisfies ComponentTokenConfig<ChatMessageBubbleTokens>
