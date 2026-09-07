import {
  stateful,
  tokenColorBlend,
  tokenColorOpacity,
  tokenParameter,
  tokenPath,
  tokenValue,
  tokenVariable,
  whenState
} from '../component-tokens/builders'
import type { ResolvableColor } from '../component-tokens/resolvable'
import { HexColorUtils } from '../utils/hex'
import type { SemanticColoringConfig } from './types'

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
  background: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    coloringBackground,
    [
      whenState(['disabled'], disabledFilledBackground, undefined, { coloringStyle: 'filled' }),
      whenState(
        ['disabled'],
        disabledForegroundStyleBackground,
        undefined,
        { coloringStyle: 'foreground' }
      ),
      whenState(
        ['disabled'],
        disabledTonalBackground,
        undefined,
        { coloringColorVariant: 'tonal' }
      ),
    ]
  ),
  foreground: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    coloringForeground,
    [
      whenState(['disabled'], disabledFilledForeground, undefined, { coloringStyle: 'filled' }),
      whenState(
        ['disabled'],
        disabledForegroundStyleForeground,
        undefined,
        { coloringStyle: 'foreground' }
      ),
      whenState(
        ['disabled'],
        disabledTonalForeground,
        undefined,
        { coloringColorVariant: 'tonal' }
      ),
    ]
  ),
  border: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    { value: HexColorUtils.transparent },
    [
      whenState(['outlined'], coloringAccent),
      whenState(['disabled'], { value: HexColorUtils.transparent }),
    ]
  ),
  outline: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    { value: HexColorUtils.transparent },
    [
      whenState(['focusVisible'], coloringAccent),
      whenState(['disabled'], { value: HexColorUtils.transparent }),
    ]
  ),
} as const

export const pressableStateLayerTintTokens = {
  tint: stateful<string, ResolvableColor<string, string>>(
    { value: HexColorUtils.transparent },
    [
      whenState(
        ['hovered'],
        tokenColorOpacity(
          tokenPath('params.color'),
          tokenPath('theme.color.tintConfig.light')
        ),
        ['disabled']
      ),
      whenState(
        ['focusVisible'],
        tokenColorOpacity(
          tokenPath('params.color'),
          tokenPath('theme.color.tintConfig.normal')
        ),
        ['disabled']
      ),
      whenState(
        ['pressed'],
        tokenColorOpacity(
          tokenPath('params.color'),
          tokenPath('theme.color.tintConfig.normal')
        ),
        ['disabled']
      ),
    ]
  ),
} as const
