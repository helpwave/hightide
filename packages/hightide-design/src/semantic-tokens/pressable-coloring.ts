import {
  stateful,
  tokenColorBlend,
  tokenColorOpacity,
  tokenPath,
  tokenValue,
  transparentColor,
  whenState
} from '../component-tokens/builders'

export const pressableColoringTokens = {
  background: stateful(
    tokenPath('params.coloring.background'),
    [
      whenState(['disabled'], tokenPath('params.disabledColoring.background'), ['tonal']),
      whenState(
        ['disabled', 'tonal'],
        tokenColorBlend(
          tokenPath('theme.color.surface.color'),
          tokenColorOpacity(
            tokenPath('theme.color.disabled.color'),
            tokenValue(0.8)
          )
        )
      ),
    ]
  ),
  foreground: stateful(
    tokenPath('params.coloring.foreground'),
    [
      whenState(['disabled'], tokenPath('params.disabledColoring.foreground'), ['tonal']),
      whenState(
        ['disabled', 'tonal'],
        tokenColorBlend(
          tokenPath('theme.color.surface.onColor'),
          tokenColorOpacity(
            tokenPath('theme.color.disabled.onColor'),
            tokenValue(0.8)
          )
        )
      ),
    ]
  ),
  border: stateful(
    transparentColor(),
    [
      whenState(['outlined'], tokenPath('params.coloring.accent')),
      whenState(['disabled'], transparentColor()),
    ]
  ),
  outline: stateful(
    transparentColor(),
    [
      whenState(['focusVisible'], tokenPath('params.coloring.accent')),
      whenState(['disabled'], transparentColor()),
    ]
  ),
} as const

export const pressableStateLayerTintTokens = {
  tint: stateful(
    transparentColor(),
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
