import { TokenBuilder } from '../../../utils'
import type { TokenRefOrValue } from '../../../utils/token-type'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, NumberValueToken, HightideResolverParams, ResolverState } from '../../../primitive-tokens'
import type { ColorPairToken } from '../../../theme-tokens/create'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ContainerTokens } from '../../container-tokens'
import type { IconTokens } from '../../icon-tokens'
import type { TextTokens } from '../../text-tokens'
import type { HightideTokenPathProvider } from '../token-context'

export type ListItemState = AssertAssignable<'tonal', ResolverState>
export type ListItemConfig = HightideResolverConfig

export type ListItemComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
}

export type ListItemTokens = AssertAssignable<{
  container: ContainerTokens,
  leadingItemContainer: ContainerTokens,
  content: ContainerTokens,
  trailingItemContainer: ContainerTokens,
  icon: IconTokens,
  titleText: TextTokens,
  descriptionText: TextTokens,
}, ComponentTokens<ListItemState, ListItemConfig>>

export type ListItemTokenResolver = ComponentTokenResolver<
  ListItemComponentResolverProps,
  ListItemTokens
>

export type ListItemParams = AssertAssignable<{
  colors: {
    foreground: ColorValueToken,
    onColor: ColorValueToken,
    background?: ColorValueToken,
  },
  numbers: {
    size: NumberValueToken,
    inset: NumberValueToken,
    horizontalContentPadding: NumberValueToken,
  },
}, HightideResolverParams>
export type ListItemTokenContext = HightideTokenPathProvider<ListItemParams>

export const listItemTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful<TokenRefOrValue<ColorValueToken>>(
      undefined,
      [
        TokenBuilder.whenState(['tonal'], TokenBuilder.colorValueRef<ListItemTokenContext>('params.colors.background')),
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
      direction: TokenBuilder.layoutDirection('horizontal'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('start'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
  },
  leadingItemContainer: {
    type: 'container',
    margin: TokenBuilder.margin({ inlineEnd: TokenBuilder.numberRef<ListItemTokenContext>('theme.spacing.md') }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
  },
  content: {
    type: 'container',
    size: TokenBuilder.stateful({
      width: TokenBuilder.percent('100%'),
    }),
    layout: TokenBuilder.stateful({
      gap: TokenBuilder.numberRef<ListItemTokenContext>('theme.spacing.xs'),
      direction: TokenBuilder.layoutDirection('vertical'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('start'),
    }),
  },
  trailingItemContainer: {
    type: 'container',
    margin: TokenBuilder.margin({ inlineStart: TokenBuilder.numberRef<ListItemTokenContext>('theme.spacing.xl') }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
  },
  icon: {
    type: 'icon',
    size: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.icongraphy.sizes.md')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.icongraphy.strokeWidth')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<ListItemTokenContext>('params.colors.foreground')),
  },
  titleText: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<ListItemTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.md.fontWeight')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<ListItemTokenContext>('params.colors.foreground')),
  },
  descriptionText: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<ListItemTokenContext>('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<ListItemTokenContext>('theme.typography.body.sm.fontWeight')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<ListItemTokenContext>('params.colors.onColor')),
  },
} as const
