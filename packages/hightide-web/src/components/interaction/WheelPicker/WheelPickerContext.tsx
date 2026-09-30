import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

export type WheelPickerRegisteredOption<T> = {
  id: string,
  value: T,
  element: HTMLDivElement,
}

export type WheelPickerContextValue<T> = {
  value: T | undefined,
  disabled: boolean,
  listboxId: string,
  registerOption: (option: WheelPickerRegisteredOption<T>) => () => void,
  selectValue: (value: T) => void,
}

export const WheelPickerContext = createContext<WheelPickerContextValue<unknown> | null>(null)

export function useWheelPickerContext<T>(): WheelPickerContextValue<T> {
  const context = useContext(WheelPickerContext)
  if (!context) {
    throw new Error('WheelPicker components must be used within a WheelPicker.Root')
  }
  return context as WheelPickerContextValue<T>
}

export type WheelPickerContextProviderProps<T> = {
  value: WheelPickerContextValue<T>,
  children: ReactNode,
}

export function WheelPickerContextProvider<T>({ value, children }: WheelPickerContextProviderProps<T>) {
  return (
    <WheelPickerContext.Provider value={value as WheelPickerContextValue<unknown>}>
      {children}
    </WheelPickerContext.Provider>
  )
}
