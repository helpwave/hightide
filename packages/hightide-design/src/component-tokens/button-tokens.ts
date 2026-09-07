import type {
  ButtonVariant,
  ComponentSize
} from '../semantic-tokens'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../utils/hex'
import {
  stateful,
  tokenCalc,
  tokenParameter,
  tokenValue,
  tokenVariable,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { Resolvable } from './resolvable'
import type { IconTokens } from './icon-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import { type PressableState } from './pressable-tokens'

export type ButtonState = PressableState

export const buttonVariants = [
  'elevated',
  'filled',
  'tonal',
  'outlined',
  'foreground',
] as const satisfies readonly ButtonVariant[]

export type ButtonComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: ButtonVariant,
  },
  state: ButtonState,
}

export type ButtonTokens = {
  container: ContainerTokens,
  stateLayer: ContainerTokens,
  icon: IconTokens,
  text: TextStyleTokens,
}

export type ButtonTokenResolver = ComponentTokenResolver<
  ButtonComponentResolverProps,
  ButtonTokens
>

const layoutSize = tokenParameter('params.layout.size', tokenVariable('theme.size.md'))
const layoutInset = tokenParameter('params.layout.inset', tokenVariable('theme.padding.md'))
const layoutBorderWidth = tokenParameter(
  'params.layout.borderWidth',
  tokenVariable('theme.borderWidth.normal')
)
const layoutBorderRadius = tokenParameter(
  'params.layout.borderRadius',
  tokenVariable('theme.borderRadius.md')
)
const layoutHorizontalContentPadding = tokenParameter(
  'params.layout.horizontalContentPadding',
  tokenVariable('theme.padding.md')
)
const tint = tokenParameter('params.tint', { value: HexColorUtils.transparent })
const textFontSize = tokenParameter(
  'params.textStyle.fontSize',
  tokenVariable('theme.typography.label.md.fontSize')
)
const textFontWeight = tokenParameter(
  'params.textStyle.fontWeight',
  tokenVariable('theme.typography.label.md.fontWeight')
)
const textFontFamily = tokenParameter(
  'params.textStyle.fontFamily',
  tokenVariable('theme.typography.label.md.fontFamily')
)
const textLineHeight = tokenParameter(
  'params.textStyle.lineHeight',
  tokenVariable('theme.typography.label.md.lineHeight')
)
const iconSize = tokenParameter('params.iconSize', tokenVariable('theme.icongraphy.sizes.md'))
const iconStrokeWidth = tokenParameter(
  'params.iconStrokeWidth',
  tokenVariable('theme.icongraphy.strokeWidth')
)
const gap = tokenParameter('params.gap', tokenVariable('theme.spacing.md'))

export const buttonTokens = {
  container: {
    backgroundColor: stateful(tokenVariable('semantics.pressableColoring.background')),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.6)),
      ]
    ),
    border: stateful<string, Resolvable<NonNullable<ContainerTokens['border']>, string, string>>(
      {
        width: {
          type: 'all',
          value: tokenValue(0),
        },
        color: {
          type: 'all',
          value: {
            value: HexColorUtils.transparent,
          },
        },
      },
      [
        whenState(['outlined'], {
          width: {
            type: 'all',
            value: layoutBorderWidth,
          },
          color: {
            type: 'all',
            value: tokenVariable('semantics.pressableColoring.border'),
          },
        }),
      ]
    ),
    outline: stateful<string, Resolvable<NonNullable<ContainerTokens['outline']>, string, string>>(
      {
        width: tokenValue(0),
        offset: tokenValue(0),
        style: 'solid',
        color: {
          value: HexColorUtils.transparent,
        },
      },
      [
        whenState(['focusVisible'], {
          width: tokenVariable('theme.focusOutline.width'),
          offset: tokenVariable('theme.focusOutline.offset'),
          style: tokenVariable('theme.focusOutline.style'),
          color: tokenVariable('semantics.pressableColoring.outline'),
        }),
      ]
    ),
    shadow: stateful(undefined,
      [
        whenState(['elevated'], tokenVariable('theme.elevation.level1'), ['hovered']),
        whenState(['elevated', 'hovered'], tokenVariable('theme.elevation.level2')),
      ]),
    size: stateful({
      minHeight: layoutSize,
    }),
    borderRadius: stateful({
      type: 'all',
      value: layoutBorderRadius,
    }),
    padding: stateful(
      {
        type: 'physicalAxis',
        vertical: layoutInset,
        horizontal: layoutHorizontalContentPadding,
      },
      [
        whenState(['outlined'], {
          type: 'physicalAxis',
          vertical: tokenCalc(
            'max',
            tokenCalc(
              'subtract',
              layoutInset,
              layoutBorderWidth
            ),
            tokenValue(0)
          ),
          horizontal: tokenCalc(
            'max',
            tokenCalc(
              'subtract',
              layoutHorizontalContentPadding,
              layoutBorderWidth
            ),
            tokenValue(0)
          ),
        }),
      ]
    ),
    layout: stateful({
      gap,
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    }),
  },
  stateLayer: {
    backgroundColor: stateful(tint),
    position: stateful({
      type: 'absolute',
      top: tokenValue(0),
      right: tokenValue(0),
      bottom: tokenValue(0),
      left: tokenValue(0),
      zIndex: tokenValue(20),
    }),
    borderRadius: stateful({
      type: 'all',
      value: layoutBorderRadius,
    }),
  },
  icon: {
    size: stateful(iconSize),
    strokeWidth: stateful(iconStrokeWidth),
    color: stateful(tokenVariable('semantics.pressableColoring.foreground')),
  },
  text: {
    color: stateful(tokenVariable('semantics.pressableColoring.foreground')),
    fontSize: stateful(textFontSize),
    fontWeight: stateful(textFontWeight),
    fontFamily: stateful(textFontFamily),
    lineHeight: stateful(textLineHeight),
  },
} as const
