import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import { surfaceDescriptionColor, surfaceFadedColor } from './shared'
import {
  stateful,
  tokenCalc,
  tokenPath,
  tokenValue
} from '../builders'

export type ChatMessageComposerTokens = {
  container: ContainerTokens,
  input: ContainerTokens,
  text: TextStyleTokens,
  placeholder: TextStyleTokens,
}

export type ChatMessageComposerTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatMessageComposerTokens
>

const composerInputMaxHeight = tokenCalc(
  'max',
  tokenPath('theme.size.md'),
  tokenCalc(
    'add',
    tokenCalc(
      'multiply',
      tokenPath('theme.typography.body.md.lineHeight'),
      tokenValue(8)
    ),
    tokenCalc(
      'multiply',
      tokenPath('theme.padding.md'),
      tokenValue(2)
    )
  )
)

export const chatMessageComposerTokens = {
  container: {
    backgroundColor: stateful(tokenPath('theme.color.surface.color')),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('theme.padding.xl'),
      horizontal: tokenPath('theme.padding.xl'),
    }),
    border: stateful({
      width: {
        type: 'physicalSide',
        top: tokenPath('theme.borderWidth.thin'),
      },
      color: {
        type: 'physicalSide',
        top: surfaceFadedColor,
      },
    }),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'end',
      selfCrossAxisAlignment: 'stretch',
      gap: tokenPath('theme.spacing.md'),
    }),
  },
  input: {
    backgroundColor: stateful(tokenPath('theme.color.surfaceVariant.color')),
    size: stateful({
      minHeight: tokenPath('theme.size.md'),
      maxHeight: composerInputMaxHeight,
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('theme.borderRadius.sm'),
    }),
    padding: stateful({
      type: 'logicalSide',
      blockStart: tokenPath('theme.padding.md'),
      blockEnd: tokenPath('theme.padding.md'),
      inlineStart: tokenCalc(
        'add',
        tokenPath('theme.padding.md'),
        tokenPath('theme.spacing.md')
      ),
      inlineEnd: tokenPath('theme.padding.md'),
    }),
    layout: stateful({
      flexGrow: tokenValue(1),
      flexShrink: tokenValue(1),
    }),
  },
  text: {
    fontSize: stateful(tokenPath('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenPath('theme.typography.body.md.fontWeight')),
    color: stateful(tokenPath('theme.color.surface.onColor')),
  },
  placeholder: {
    color: stateful(surfaceDescriptionColor),
  },
} as const
