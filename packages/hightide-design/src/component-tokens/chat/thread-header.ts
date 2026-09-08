import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { PressableOverrideTokens } from '../pressable-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import type { AvatarOverrideTokens } from '../avatar-tokens'
import type { ComponentTokenConfig } from '../token-config'
import { surfaceDescriptionColor, surfaceFadedColor } from './shared'
import {
  stateful,
  tokenCalc,
  tokenVariable,
  tokenValue
} from '../builders'

export type ChatThreadHeaderTokens = {
  container: ContainerTokens,
  contentRow: ContainerTokens,
  title: TextStyleTokens,
  subtitle: TextStyleTokens,
  avatarOverride: AvatarOverrideTokens,
  pressableOverwrites: PressableOverrideTokens,
}

export type ChatThreadHeaderTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatThreadHeaderTokens
>

const threadAvatarSize = tokenCalc(
  'max',
  tokenCalc(
    'add',
    tokenVariable('theme.typography.body.md.lineHeight'),
    tokenCalc(
      'add',
      tokenVariable('theme.typography.body.sm.lineHeight'),
      tokenVariable('theme.spacing.xs')
    )
  ),
  tokenVariable('theme.icongraphy.sizes.lg')
)

export const chatThreadHeaderTokens = {
  container: {
    backgroundColor: stateful(tokenVariable('theme.color.surface.color')),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenVariable('theme.padding.sm'),
      horizontal: tokenVariable('theme.padding.md'),
    }),
    border: stateful({
      width: {
        type: 'physicalSide',
        bottom: tokenVariable('theme.borderWidth.thin'),
      },
      color: {
        type: 'physicalSide',
        bottom: surfaceFadedColor,
      },
    }),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: tokenVariable('theme.spacing.xs'),
    }),
  },
  contentRow: {
    layout: stateful({
      direction: 'vertical',
      gap: tokenVariable('theme.spacing.xs'),
      flexGrow: tokenValue(1),
    }),
  },
  title: {
    fontSize: stateful(tokenVariable('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.bold')),
    color: stateful(tokenVariable('theme.color.surface.onColor')),
  },
  subtitle: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.light')),
    color: stateful(surfaceDescriptionColor),
  },
  avatarOverride: {
    container: {
      size: stateful({
        width: threadAvatarSize,
        height: threadAvatarSize,
        minWidth: threadAvatarSize,
        minHeight: threadAvatarSize,
        maxWidth: threadAvatarSize,
        maxHeight: threadAvatarSize,
      }),
      borderRadius: stateful({
        type: 'all',
        value: tokenCalc('divide', threadAvatarSize, tokenValue(2)),
      }),
    },
    icon: {
      size: stateful(threadAvatarSize),
    },
  },
  pressableOverwrites: {
    overrides: {
      size: 'md',
      coloringStyle: 'foreground',
      coloringColorVariant: 'transparent',
    },
    container: {
      size: stateful({
        minHeight: tokenValue(0),
      }),
      padding: stateful({
        type: 'all',
        value: tokenVariable('theme.padding.md'),
      }),
      layout: stateful({
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        gap: tokenVariable('theme.spacing.md'),
        flexGrow: tokenValue(1),
      }),
    },
  },
} as const satisfies ComponentTokenConfig<ChatThreadHeaderTokens>
