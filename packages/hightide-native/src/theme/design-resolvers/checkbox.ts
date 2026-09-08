import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import {
  checkboxTokens,
  toInputState,
  toPressableState,
  type CheckboxStateValue,
  type CheckboxTokenResolver,
  type CheckboxTokens
} from '@helpwave/hightide-design/component-tokens'
import type {
  ControlElementLayoutToken,
  InputColoringTokens
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveConfigNode } from '../static-resolve/resolve'
import {
  resolveInputColoring,
  resolvePressableStateLayerTint
} from './semantic'

type CheckboxTokenState = CheckboxStateValue | 'rounded' | 'active'

type CheckboxParams = {
  layout: ControlElementLayoutToken,
  coloring: InputColoringTokens,
  tint: ColorToken,
  accentColor: ColorToken,
  accentOnColor: ColorToken,
}

export const checkboxTokenResolver: CheckboxTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const accentPair = overrides.color ?? themeTokens.color.primary
  const layout = semanticResolvers.controlLayout({ themeTokens, size })
  const coloring = resolveInputColoring({
    themeTokens,
    state: toInputState(state),
    color: overrides.color,
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: toPressableState(state),
    color: accentPair.color,
  })
  const states = new Set<CheckboxTokenState>(state)

  if (state.has('checked') || state.has('indeterminate')) {
    states.add('active')
  }

  if (overrides.isRounded) {
    states.add('rounded')
  }

  return resolveConfigNode<CheckboxTokens>(
    checkboxTokens,
    {
      theme: themeTokens,
      params: {
        layout,
        coloring,
        tint,
        accentColor: accentPair.color,
        accentOnColor: accentPair.onColor,
      } satisfies CheckboxParams,
      state: states,
    }
  )
}
