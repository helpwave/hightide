import type {
  CheckboxState as DesignCheckboxState,
  CheckboxStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import type {
  CheckboxIconStyle,
  CheckboxState,
  CheckboxStateLayerStyle,
  CheckboxStyle,
  CheckboxThemeResolvers
} from '../types/components/checkbox'
import {
  createStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

const toDesignCheckboxState = (state: CheckboxState): DesignCheckboxState => {
  const active = new Set<CheckboxStateValue>()

  if (state.isDisabled) {
    active.add('disabled')
  }
  if (state.isFocused) {
    active.add('focused')
  }
  if (state.isFocusVisible) {
    active.add('focusVisible')
  }
  if (state.isHovered) {
    active.add('hovered')
  }
  if (state.isPressed) {
    active.add('pressed')
  }
  if (state.isReadonly) {
    active.add('readonly')
  }
  if (state.isInvalid) {
    active.add('invalid')
  }
  if (state.isChecked) {
    active.add('checked')
  }
  if (state.isIndeterminate) {
    active.add('indeterminate')
  }

  return active
}

const toNumberSize = (value: string | number | undefined): number => (
  typeof value === 'number' ? value : 0
)

export const toCheckboxThemeResolvers: ComponentThemeResolver<CheckboxThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: CheckboxState) => componentTokens.checkbox({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      size: state.size,
      isRounded: state.isRounded,
      color: state.color,
    },
    state: toDesignCheckboxState(state),
  })

  return {
    container: createStyleResolver((state: CheckboxState): CheckboxStyle => (
      StyleAdapterUtils.container(resolve(state).container)
    )),
    stateLayer: createStyleResolver((state: CheckboxState): CheckboxStateLayerStyle => {
      const tokens = resolve(state)
      const containerStyle = StyleAdapterUtils.container(tokens.container)
      const touchTargetSize = semanticTokens.touchTargetSize({ themeTokens })
      const width = toNumberSize(containerStyle.width as string | number | undefined)
      const height = toNumberSize(containerStyle.height as string | number | undefined)
      const horizontal = Math.max(0, touchTargetSize - width) / 2
      const vertical = Math.max(0, touchTargetSize - height) / 2

      return {
        ...StyleAdapterUtils.container(tokens.stateLayer),
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 20,
        marginTop: -vertical,
        marginRight: -horizontal,
        marginBottom: -vertical,
        marginLeft: -horizontal,
      }
    }),
    icon: createStyleResolver((state: CheckboxState): CheckboxIconStyle => (
      StyleAdapterUtils.icon(resolve(state).icon)
    )),
  }
}
