import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, ColorToken, HightideResolverConfig, NumberToken, HightideResolverParams, ResolverState } from '../../../primitive-tokens'
import type { ColorPairToken } from '../../../theme-tokens/create'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../../resolvable-text-style-tokens'
import type { HightideTokenPathProvider } from '../token-context'

export type ListItemState = AssertAssignable<'tonal', ResolverState>
export type ListItemConfig = HightideResolverConfig

export type ListItemComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
}

export type ListItemTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ListItemState, ListItemConfig>,
  leadingItemContainer: ResolvableContainerTokens<ListItemState, ListItemConfig>,
  content: ResolvableContainerTokens<ListItemState, ListItemConfig>,
  trailingItemContainer: ResolvableContainerTokens<ListItemState, ListItemConfig>,
  icon: ResolvableIconTokens<ListItemState, ListItemConfig>,
  titleText: ResolvableTextStyleTokens<ListItemState, ListItemConfig>,
  descriptionText: ResolvableTextStyleTokens<ListItemState, ListItemConfig>,
}, ComponentTokens<ListItemState, ListItemConfig>>

export type ListItemTokenResolver = ComponentTokenResolver<
  ListItemComponentResolverProps,
  ListItemTokens
>

export type ListItemParams = AssertAssignable<{
  colors: {
    foreground: ColorToken,
    onColor: ColorToken,
    background?: ColorToken,
  },
  numbers: {
    size: NumberToken,
    inset: NumberToken,
    horizontalContentPadding: NumberToken,
  },
}, HightideResolverParams>
export type ListItemTokenContext = HightideTokenPathProvider<ListItemParams>

export const listItemTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(
      undefined,
      [
        TokenBuilder.whenState(['tonal'], TokenBuilder.colorRef<ListItemTokenContext>('params.colors.background')),
      ]
    ),
    size: TokenBuilder.stateful({
      minWidth: TokenBuilder.numberRef<ListItemTokenContext>('params.numbers.size'),
      minHeight: TokenBuilder.calc(
        'add',
        TokenBuilder.numberRef<ListItemTokenContext>('params.numbers.size'),
        TokenBuilder.numberRef<ListItemTokenContext>('theme.spacing.md')
      ),
    }),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef<ListItemTokenContext>('params.numbers.inset'), horizontal: TokenBuilder.numberRef<ListItemTokenContext>('params.numbers.horizontalContentPadding') }),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'start',
      crossAxisAlignment: 'center',
    }),
  },
  leadingItemContainer: {
    margin: TokenBuilder.margin({ inlineEnd: TokenBuilder.numberRef<ListItemTokenContext>('theme.spacing.md') }),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
    }),
  },
  content: {
    kind: 'container' as const,
    size: TokenBuilder.stateful({
      width: TokenBuilder.percent('100%'),
    }),
    layout: TokenBuilder.stateful({
      gap: TokenBuilder.numberRef<ListItemTokenContext>('theme.spacing.xs'),
      direction: 'vertical',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'start',
    }),
  },
  trailingItemContainer: {
    margin: TokenBuilder.margin({ inlineStart: TokenBuilder.numberRef<ListItemTokenContext>('theme.spacing.xl') }),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
    }),
  },
  icon: {
    kind: 'icon' as const,
    size: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.icongraphy.sizes.md')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.icongraphy.strokeWidth')),
    color: TokenBuilder.stateful(TokenBuilder.colorRef<ListItemTokenContext>('params.colors.foreground')),
  },
  titleText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<ListItemTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.md.fontWeight')),
    color: TokenBuilder.stateful(TokenBuilder.colorRef<ListItemTokenContext>('params.colors.foreground')),
  },
  descriptionText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<ListItemTokenContext>('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.sm.fontWeight')),
    color: TokenBuilder.stateful(TokenBuilder.colorRef<ListItemTokenContext>('params.colors.onColor')),
  },
} as const
