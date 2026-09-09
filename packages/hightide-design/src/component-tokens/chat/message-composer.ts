import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import type { ComponentTokenConfig } from '../token-config'
import { surfaceDescriptionColor, surfaceFadedColor } from './shared'
import {
  stateful,
  tokenCalc,
  tokenVariable,
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
  tokenVariable('theme.size.md'),
  tokenCalc(
    'add',
    tokenCalc(
      'multiply',
      tokenVariable('theme.typography.body.md.lineHeight'),
      tokenValue(8)
    ),
    tokenCalc(
      'multiply',
      tokenVariable('theme.padding.md'),
      tokenValue(2)
    )
  )
)

export const chatMessageComposerTokens = {
  container: {
    backgroundColor: stateful(tokenVariable('theme.color.surface.color')),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenVariable('theme.padding.xl'),
      horizontal: tokenVariable('theme.padding.xl'),
    }),
    border: stateful({
      width: {
        type: 'physicalSide',
        top: tokenVariable('theme.borderWidth.thin'),
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
      gap: tokenVariable('theme.spacing.md'),
    }),
  },
  input: {
    backgroundColor: stateful(tokenVariable('theme.color.surfaceVariant.color')),
    size: stateful({
      minHeight: tokenVariable('theme.size.md'),
      maxHeight: composerInputMaxHeight,
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenVariable('theme.borderRadius.sm'),
    }),
    padding: stateful({
      type: 'logicalSide',
      blockStart: tokenVariable('theme.padding.md'),
      blockEnd: tokenVariable('theme.padding.md'),
      inlineStart: tokenCalc(
        'add',
        tokenVariable('theme.padding.md'),
        tokenVariable('theme.spacing.md')
      ),
      inlineEnd: tokenVariable('theme.padding.md'),
    }),
    layout: stateful({
      flexGrow: tokenValue(1),
      flexShrink: tokenValue(1),
    }),
  },
  text: {
    fontSize: stateful(tokenVariable('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.typography.body.md.fontWeight')),
    color: stateful(tokenVariable('theme.color.surface.onColor')),
  },
  placeholder: {
    color: stateful(surfaceDescriptionColor),
  },
} as const satisfies ComponentTokenConfig<ChatMessageComposerTokens>
