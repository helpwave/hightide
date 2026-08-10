import type { PressableVariant } from '../semantic-token-resolvers/types'
import type { StateBasedProperty } from '../theme-tokens/stateBasedProperty'

export type PressableState =
  | 'disabled'
  | 'focused'
  | 'focusVisible'
  | 'hovered'
  | 'pressed'

export type PressableInteractionState = {
  isDisabled?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isFocusVisible?: boolean,
  isPressed?: boolean,
}

export type PressableStateBasedProperty<P> = StateBasedProperty<PressableState, P>

export const pressableVariants = [
  'elevated',
  'filled',
  'tonal',
  'outlined',
  'foreground',
] as const satisfies readonly PressableVariant[]

export const toActivePressableStates = (
  state: PressableInteractionState
): ReadonlySet<PressableState> => {
  const active = new Set<PressableState>()

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

  return active
}
