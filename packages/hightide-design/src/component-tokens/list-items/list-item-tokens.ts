import type { ColorToken } from '../../primitive-tokens/color'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ControlElementLayoutToken } from '../../semantic-tokens'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  stateful,
  tokenCalc,
  createTokenVariable,
  whenState
} from '../builders'
import type { ComponentTokenConfig } from '../token-config'
import type { TokenContext } from '../token-context'

export type ListItemComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
}

export type ListItemTokens = {
  container: ContainerTokens,
  leadingItemContainer: ContainerTokens,
  content: ContainerTokens,
  trailingItemContainer: ContainerTokens,
  icon: IconTokens,
  titleText: TextStyleTokens,
  descriptionText: TextStyleTokens,
}

export type ListItemTokenResolver = ComponentTokenResolver<
  ListItemComponentResolverProps,
  ListItemTokens
>

export type ListItemParams = {
  layout: ControlElementLayoutToken,
  largeLayout: ControlElementLayoutToken,
  titleColor: ColorToken,
  descriptionColor: ColorToken,
  backgroundColor?: ColorToken,
}
export type ListItemTokenContext = TokenContext<ListItemParams>

const tokenVariable = createTokenVariable<ListItemParams>()

export const listItemTokens = {
  container: {
    backgroundColor: stateful(
      undefined,
      [
        whenState(['tonal'], tokenVariable('params.backgroundColor')),
      ]
    ),
    size: stateful({
      minWidth: tokenVariable('params.layout.size'),
      minHeight: tokenCalc(
        'add',
        tokenVariable('params.layout.size'),
        tokenVariable('theme.spacing.md')
      ),
    }),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenVariable('params.largeLayout.inset'),
      horizontal: tokenVariable('params.layout.horizontalContentPadding'),
    }),
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'start',
      crossAxisAlignment: 'center',
    }),
  },
  leadingItemContainer: {
    margin: stateful({
      type: 'logicalSide',
      inlineEnd: tokenVariable('theme.spacing.md'),
    }),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
    }),
  },
  content: {
    size: stateful({
      width: '100%',
    }),
    layout: stateful({
      gap: tokenVariable('theme.spacing.xs'),
      direction: 'vertical',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'start',
    }),
  },
  trailingItemContainer: {
    margin: stateful({
      type: 'logicalSide',
      inlineStart: tokenVariable('theme.spacing.xl'),
    }),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
    }),
  },
  icon: {
    size: stateful(tokenVariable('theme.icongraphy.sizes.md')),
    strokeWidth: stateful(tokenVariable('theme.icongraphy.strokeWidth')),
    color: stateful(tokenVariable('params.titleColor')),
  },
  titleText: {
    fontSize: stateful(tokenVariable('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.typography.body.md.fontWeight')),
    color: stateful(tokenVariable('params.titleColor')),
  },
  descriptionText: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.typography.body.sm.fontWeight')),
    color: stateful(tokenVariable('params.descriptionColor')),
  },
} as const satisfies ComponentTokenConfig<ListItemTokens, ListItemTokenContext>
