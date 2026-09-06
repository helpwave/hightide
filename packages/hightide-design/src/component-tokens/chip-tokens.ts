import {
  type ChipVariant,
  type ComponentSize
} from '../semantic-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  tokenCalc,
  tokenPath,
  tokenValue
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export type ChipComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: ChipVariant,
  },
}

export type ChipTokens = {
  container: ContainerTokens,
  icon: IconTokens,
  text: TextStyleTokens,
}

export type ChipTokenResolver = ComponentTokenResolver<
  ChipComponentResolverProps,
  ChipTokens
>

export const chipTokens = {
  container: {
    backgroundColor: stateful(tokenPath('params.coloring.background')),
    size: stateful({
      minWidth: tokenValue(0),
      minHeight: tokenPath('params.layout.size'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('params.layout.borderRadius'),
    }),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('params.layout.inset'),
      horizontal: tokenCalc(
        'add',
        tokenPath('params.layout.inset'),
        tokenPath('params.layout.paddingExtension')
      ),
    }),
    layout: stateful({
      gap: tokenPath('params.gap'),
      direction: 'horizontal',
      mainAxisAlignment: 'start',
      crossAxisAlignment: 'center',
    }),
  },
  icon: {
    size: stateful(tokenPath('params.iconSize')),
    strokeWidth: stateful(tokenPath('params.iconStrokeWidth')),
    color: stateful(tokenPath('params.coloring.foreground')),
  },
  text: {
    color: stateful(tokenPath('params.coloring.foreground')),
    fontSize: stateful(tokenPath('params.textStyle.fontSize')),
    fontWeight: stateful(tokenPath('params.textStyle.fontWeight')),
    fontFamily: stateful(tokenPath('params.textStyle.fontFamily')),
    lineHeight: stateful(tokenPath('params.textStyle.lineHeight')),
  },
} as const
