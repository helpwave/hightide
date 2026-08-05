import type { PressableColoringStyle } from '../semantic-token-resolvers/types'
import type { StateBasedProperty } from '../theme-tokens/stateBasedProperty'

export type PressableState = 'disabled' | 'focused' | 'hovered' | 'pressed'

export type PressableInteractionState = {
  isDisabled?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isPressed?: boolean,
}

export type PressableStateBasedProperty<P> = StateBasedProperty<PressableState, P>

export const pressableColoringStyles = [
  'filled',
  'outline',
  'tonal',
  'tonal-outline',
  'text',
] as const satisfies readonly PressableColoringStyle[]

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
  if (state.isHovered) {
    active.add('hovered')
  }
  if (state.isPressed) {
    active.add('pressed')
  }

  return active
}
