import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { PressableOverrideTokens } from '../pressable-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import type { AvatarOverrideTokens } from '../avatar-tokens'
import { surfaceDescriptionColor, surfaceFadedColor } from './shared'
import {
  stateful,
  tokenCalc,
  tokenPath,
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
    tokenPath('theme.typography.body.md.lineHeight'),
    tokenCalc(
      'add',
      tokenPath('theme.typography.body.sm.lineHeight'),
      tokenPath('theme.spacing.xs')
    )
  ),
  tokenPath('theme.icongraphy.sizes.lg')
)

export const chatThreadHeaderTokens = {
  container: {
    backgroundColor: stateful(tokenPath('theme.color.surface.color')),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('theme.padding.sm'),
      horizontal: tokenPath('theme.padding.md'),
    }),
    border: stateful({
      width: {
        type: 'physicalSide',
        bottom: tokenPath('theme.borderWidth.thin'),
      },
      color: {
        type: 'physicalSide',
        bottom: surfaceFadedColor,
      },
    }),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: tokenPath('theme.spacing.xs'),
    }),
  },
  contentRow: {
    layout: stateful({
      direction: 'vertical',
      gap: tokenPath('theme.spacing.xs'),
      flexGrow: tokenValue(1),
    }),
  },
  title: {
    fontSize: stateful(tokenPath('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.bold')),
    color: stateful(tokenPath('theme.color.surface.onColor')),
  },
  subtitle: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.light')),
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
        value: tokenPath('theme.padding.md'),
      }),
      layout: stateful({
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        gap: tokenPath('theme.spacing.md'),
        flexGrow: tokenValue(1),
      }),
    },
  },
} as const
