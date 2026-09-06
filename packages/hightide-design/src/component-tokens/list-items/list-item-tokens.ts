import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  stateful,
  tokenCalc,
  tokenPath,
  whenState
} from '../builders'

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

export const listItemTokens = {
  container: {
    backgroundColor: stateful(
      undefined,
      [
        whenState(['tonal'], tokenPath('params.backgroundColor')),
      ]
    ),
    size: stateful({
      minWidth: tokenPath('params.layout.size'),
      minHeight: tokenCalc(
        'add',
        tokenPath('params.layout.size'),
        tokenPath('theme.spacing.md')
      ),
    }),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('params.largeLayout.inset'),
      horizontal: tokenPath('params.layout.horizontalContentPadding'),
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
      inlineEnd: tokenPath('theme.spacing.md'),
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
      gap: tokenPath('theme.spacing.xs'),
      direction: 'vertical',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'start',
    }),
  },
  trailingItemContainer: {
    margin: stateful({
      type: 'logicalSide',
      inlineStart: tokenPath('theme.spacing.xl'),
    }),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
    }),
  },
  icon: {
    size: stateful(tokenPath('theme.icongraphy.sizes.md')),
    strokeWidth: stateful(tokenPath('theme.icongraphy.strokeWidth')),
    color: stateful(tokenPath('params.titleColor')),
  },
  titleText: {
    fontSize: stateful(tokenPath('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenPath('theme.typography.body.md.fontWeight')),
    color: stateful(tokenPath('params.titleColor')),
  },
  descriptionText: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.typography.body.sm.fontWeight')),
    color: stateful(tokenPath('params.descriptionColor')),
  },
} as const
