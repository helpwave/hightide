import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { Resolvable } from '../resolvable'
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
  tokenPath,
  tokenValue,
  whenState
} from '../builders'

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
  tokenPath('theme.size.md'),
  tokenValue(16)
)

const outgoingDescription = tokenColorBlend(
  tokenPath('theme.color.primary.color'),
  tokenColorOpacity(
    tokenPath('theme.color.primary.onColor'),
    tokenPath('theme.config.appearancePercentages.subtle')
  )
)

const incomingDescription = tokenColorBlend(
  tokenPath('theme.color.surface.color'),
  tokenColorOpacity(
    tokenPath('theme.color.surface.onColor'),
    tokenPath('theme.config.appearancePercentages.subtle')
  )
)

export const chatMessageBubbleTokens = {
  container: {
    backgroundColor: stateful(
      tokenPath('theme.color.surface.color'),
      [
        whenState(['outgoing'], tokenPath('theme.color.primary.color')),
      ]
    ),
    size: stateful({
      maxWidth: bubbleMaxWidth,
    }),
    borderRadius: messageCornersTokens,
    padding: stateful({
      type: 'physicalSide',
      left: tokenPath('theme.padding.xl'),
      right: tokenPath('theme.padding.xl'),
      top: tokenPath('theme.padding.lg'),
      bottom: tokenPath('theme.padding.md'),
    }),
    margin: stateful<string, Resolvable<NonNullable<ContainerTokens['margin']>, string, string>>({
      type: 'logicalSide',
      inlineEnd: tokenPath('theme.spacing.xxl'),
    }, [
      whenState(['outgoing'], {
        type: 'logicalSide',
        inlineStart: tokenPath('theme.spacing.xxl'),
      }),
    ]),
    layout: stateful({
      gap: tokenPath('theme.spacing.sm'),
      direction: 'vertical',
      selfCrossAxisAlignment: 'start',
    }, [
      whenState(['outgoing'], {
        gap: tokenPath('theme.spacing.sm'),
        direction: 'vertical',
        selfCrossAxisAlignment: 'end',
      }),
    ]),
    shadow: stateful(tokenPath('theme.elevation.level1')),
  },
  body: {
    layout: stateful({
      direction: 'vertical',
    }),
  },
  bodyText: {
    fontSize: stateful(tokenPath('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.light')),
    color: stateful(
      tokenPath('theme.color.surface.onColor'),
      [
        whenState(['outgoing'], tokenPath('theme.color.primary.onColor')),
      ]
    ),
  },
  metaDataContainer: {
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'end',
      crossAxisAlignment: 'center',
      gap: tokenPath('theme.spacing.md'),
      selfCrossAxisAlignment: 'end',
    }),
  },
  metaDataStatusContainer: {
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: tokenPath('theme.spacing.xs'),
    }),
  },
  metaDataText: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.medium')),
    color: stateful(incomingDescription, [
      whenState(['outgoing'], outgoingDescription),
    ]),
  },
  metaDataIcon: {
    size: stateful(tokenPath('theme.icongraphy.sizes.xs')),
    strokeWidth: stateful(tokenPath('theme.icongraphy.strokeWidth')),
    color: stateful(incomingDescription, [
      whenState(['outgoing'], outgoingDescription),
    ]),
  },
} as const
