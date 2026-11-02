import { createContext, useContext, type ReactNode } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { WheelPickerEvent, WheelPickerState } from './WheelPickerState'

export type WheelPickerRegisteredOption<T> = {
  id: string,
  value: T,
  element: HTMLElement,
}

export interface WheelPickerContextConfig extends DOMInputConfig {
  isLooping: boolean,
  visibleRows: number,
}

export type WheelPickerContextValue<T> = DOMInputContextValue<
  WheelPickerState<T>,
  WheelPickerEvent<T>,
  WheelPickerContextConfig
>

export const WheelPickerContext = createContext<WheelPickerContextValue<unknown> | null>(null)

export function useWheelPickerContext<T>(): WheelPickerContextValue<T> {
  const context = useContext(WheelPickerContext)
  if (!context) {
    throw new Error('useWheelPickerContext must be used inside a WheelPicker.StateManager')
  }
  return context as WheelPickerContextValue<T>
}

export type WheelPickerListContextValue<T> = {
  listboxId: string,
  registerOption: (option: WheelPickerRegisteredOption<T>) => () => void,
  selectValue: (value: T) => void,
}

export const WheelPickerListContext = createContext<WheelPickerListContextValue<unknown> | null>(null)

export function useWheelPickerListContext<T>(): WheelPickerListContextValue<T> {
  const context = useContext(WheelPickerListContext)
  if (!context) {
    throw new Error('WheelPicker.Option must be used inside a WheelPicker.Root')
  }
  return context as WheelPickerListContextValue<T>
}

export function WheelPickerListContextProvider<T>({
  value,
  children,
}: {
  value: WheelPickerListContextValue<T>,
  children?: ReactNode,
}) {
  return (
    <WheelPickerListContext.Provider value={value as WheelPickerListContextValue<unknown>}>
      {children}
    </WheelPickerListContext.Provider>
  )
}
