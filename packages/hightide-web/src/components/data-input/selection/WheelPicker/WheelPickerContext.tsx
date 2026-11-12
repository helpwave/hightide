import type { RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { SelectionOptionData } from '../option'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { WheelPickerEvent, WheelPickerState } from './WheelPickerState'

export interface WheelPickerContextConfig extends DOMInputConfig {
  isLooping: boolean,
  visibleRows: number,
}

export type WheelPickerActions<T> = {
  stepBy: (steps: number) => void,
  moveSelection: (direction: 'start' | 'end') => void,
  selectValue: (value: T) => void,
}

export type WheelPickerContextValue<T> = DOMInputContextValue<
  WheelPickerState<T>,
  WheelPickerEvent<T>,
  WheelPickerContextConfig
> & {
  options: readonly SelectionOptionData<T>[],
  optionElementsRef: RefObject<Record<string, HTMLElement | null>>,
  itemsRef: RefObject<HTMLDivElement | null>,
  isPreview: boolean,
  actionsRef: RefObject<WheelPickerActions<T>>,
}

export const WheelPickerContext = createContext<WheelPickerContextValue<unknown> | null>(null)

export function useWheelPickerContext<T>(): WheelPickerContextValue<T> {
  const context = useContext(WheelPickerContext)
  if (!context) {
    throw new Error('useWheelPickerContext must be used inside a WheelPicker.StateManager')
  }
  return context as WheelPickerContextValue<T>
}
