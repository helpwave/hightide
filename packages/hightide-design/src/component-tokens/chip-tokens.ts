import {
  type ChipVariant,
  type ColoringToken,
  type ComponentSize,
  type InsideControlElementLayoutToken
} from '../semantic-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { TypographyStyleToken } from '../theme-tokens/typography-style-token'
import {
  stateful,
  tokenCalc,
  createTokenVariable,
  tokenValue
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import type { ComponentTokenConfig } from './token-config'
import type { TokenContext } from './token-context'

export type ChipParams = {
  layout: InsideControlElementLayoutToken,
  coloring: ColoringToken,
  textStyle: TypographyStyleToken,
  gap: number,
  iconSize: number,
  iconStrokeWidth: number,
}
export type ChipTokenContext = TokenContext<ChipParams>

const tokenVariable = createTokenVariable<ChipParams>()

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
    backgroundColor: stateful(tokenVariable('params.coloring.background')),
    size: stateful({
      minWidth: tokenValue(0),
      minHeight: tokenVariable('params.layout.size'),
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenVariable('params.layout.borderRadius'),
    }),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenVariable('params.layout.inset'),
      horizontal: tokenCalc(
        'add',
        tokenVariable('params.layout.inset'),
        tokenVariable('params.layout.paddingExtension')
      ),
    }),
    layout: stateful({
      gap: tokenVariable('params.gap'),
      direction: 'horizontal',
      mainAxisAlignment: 'start',
      crossAxisAlignment: 'center',
    }),
  },
  icon: {
    size: stateful(tokenVariable('params.iconSize')),
    strokeWidth: stateful(tokenVariable('params.iconStrokeWidth')),
    color: stateful(tokenVariable('params.coloring.foreground')),
  },
  text: {
    color: stateful(tokenVariable('params.coloring.foreground')),
    fontSize: stateful(tokenVariable('params.textStyle.fontSize')),
    fontWeight: stateful(tokenVariable('params.textStyle.fontWeight')),
    fontFamily: stateful(tokenVariable('params.textStyle.fontFamily')),
    lineHeight: stateful(tokenVariable('params.textStyle.lineHeight')),
  },
} as const satisfies ComponentTokenConfig<ChipTokens, ChipTokenContext>
