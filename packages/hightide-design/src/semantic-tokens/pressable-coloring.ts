import {
  stateful,
  tokenColorBlend,
  tokenColorOpacity,
  tokenParameter,
  tokenValue,
  tokenVariable,
  whenState
} from '../component-tokens/builders'
import type { ResolvableColor } from '../component-tokens/resolvable'
import { HexColorUtils } from '../utils/hex'
import {
  buttonVariantsWithColorVariant,
  buttonVariantsWithStyle
} from './coloring-style'
import type { PressableButtonColoringConfig } from './types'

const coloringBackground = tokenParameter(
  'params.coloring.background',
  tokenVariable('semantics.coloringStyle.background')
)
const coloringForeground = tokenParameter(
  'params.coloring.foreground',
  tokenVariable('semantics.coloringStyle.foreground')
)
const coloringAccent = tokenParameter(
  'params.coloring.accent',
  tokenVariable('semantics.coloringStyle.accent')
)

const disabledFilledBackground = tokenParameter(
  'params.disabledColoring.background',
  tokenVariable('theme.color.disabled.color')
)
const disabledForegroundStyleBackground = tokenParameter(
  'params.disabledColoring.background',
  { value: HexColorUtils.transparent }
)
const disabledFilledForeground = tokenParameter(
  'params.disabledColoring.foreground',
  tokenVariable('theme.color.disabled.onColor')
)
const disabledForegroundStyleForeground = tokenParameter(
  'params.disabledColoring.foreground',
  tokenVariable('theme.color.disabled.color')
)

const disabledTonalBackground = tokenColorBlend(
  tokenVariable('theme.color.surface.color'),
  tokenColorOpacity(
    tokenVariable('theme.color.disabled.color'),
    tokenValue(0.8)
  )
)
const disabledTonalForeground = tokenColorBlend(
  tokenVariable('theme.color.surface.onColor'),
  tokenColorOpacity(
    tokenVariable('theme.color.disabled.onColor'),
    tokenValue(0.8)
  )
)

export const pressableColoringTokens = {
  background: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    coloringBackground,
    [
      whenState(['disabled'], disabledFilledBackground, undefined, { coloringStyle: 'filled' }),
      ...buttonVariantsWithStyle('filled').map((variant) => (
        whenState(['disabled'], disabledFilledBackground, undefined, { variant })
      )),
      whenState(
        ['disabled'],
        disabledForegroundStyleBackground,
        undefined,
        { coloringStyle: 'foreground' }
      ),
      ...buttonVariantsWithStyle('foreground').map((variant) => (
        whenState(['disabled'], disabledForegroundStyleBackground, undefined, { variant })
      )),
      whenState(
        ['disabled'],
        disabledTonalBackground,
        undefined,
        { coloringColorVariant: 'tonal' }
      ),
      ...buttonVariantsWithColorVariant('tonal').map((variant) => (
        whenState(['disabled'], disabledTonalBackground, undefined, { variant })
      )),
    ]
  ),
  foreground: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    coloringForeground,
    [
      whenState(['disabled'], disabledFilledForeground, undefined, { coloringStyle: 'filled' }),
      ...buttonVariantsWithStyle('filled').map((variant) => (
        whenState(['disabled'], disabledFilledForeground, undefined, { variant })
      )),
      whenState(
        ['disabled'],
        disabledForegroundStyleForeground,
        undefined,
        { coloringStyle: 'foreground' }
      ),
      ...buttonVariantsWithStyle('foreground').map((variant) => (
        whenState(['disabled'], disabledForegroundStyleForeground, undefined, { variant })
      )),
      whenState(
        ['disabled'],
        disabledTonalForeground,
        undefined,
        { coloringColorVariant: 'tonal' }
      ),
      ...buttonVariantsWithColorVariant('tonal').map((variant) => (
        whenState(['disabled'], disabledTonalForeground, undefined, { variant })
      )),
    ]
  ),
  border: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    { value: HexColorUtils.transparent },
    [
      whenState(['outlined'], coloringAccent),
      whenState(['disabled'], { value: HexColorUtils.transparent }),
    ]
  ),
  outline: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    { value: HexColorUtils.transparent },
    [
      whenState(['focusVisible'], coloringAccent),
      whenState(['disabled'], { value: HexColorUtils.transparent }),
    ]
  ),
} as const

const stateLayerTintColor = tokenParameter(
  'params.color',
  tokenVariable('semantics.coloringStyle.foreground')
)

export const pressableStateLayerTintTokens = {
  tint: stateful<string, ResolvableColor<string, string>>(
    { value: HexColorUtils.transparent },
    [
      whenState(
        ['hovered'],
        tokenColorOpacity(
          stateLayerTintColor,
          tokenVariable('theme.color.tintConfig.light')
        ),
        ['disabled']
      ),
      whenState(
        ['focusVisible'],
        tokenColorOpacity(
          stateLayerTintColor,
          tokenVariable('theme.color.tintConfig.normal')
        ),
        ['disabled']
      ),
      whenState(
        ['pressed'],
        tokenColorOpacity(
          stateLayerTintColor,
          tokenVariable('theme.color.tintConfig.normal')
        ),
        ['disabled']
      ),
    ]
  ),
} as const
