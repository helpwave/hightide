import type { PressableStateCallbackType } from 'react-native'

export type PressableInteractionState = PressableStateCallbackType & {
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
}
