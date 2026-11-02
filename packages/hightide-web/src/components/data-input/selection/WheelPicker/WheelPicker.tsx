import type { ComponentRef, Ref } from 'react'
import { useCallback } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { WheelPickerBar, type WheelPickerBarProps } from './WheelPickerBar'
import { WheelPickerContext } from './WheelPickerContext'
import { WheelPickerOption } from './WheelPickerOption'
import { WheelPickerRoot, type WheelPickerRootProps } from './WheelPickerRoot'
import { WheelPickerStateManager } from './WheelPickerStateManager'
import type { WheelPickerEvent, WheelPickerLoopEvent, WheelPickerState } from './WheelPickerState'

export type WheelPickerProps<T> = ControllableDOMInputProps<T | undefined, WheelPickerEvent<T>>
  & {
    isLooping?: boolean,
    visibleRows?: number,
    onLoop?: (event: WheelPickerLoopEvent<T>) => void,
    children?: WheelPickerRootProps['children'],
    rootRef?: Ref<ComponentRef<typeof WheelPickerRoot>>,
    rootProps?: Omit<WheelPickerRootProps, 'children'>,
    barRef?: Ref<ComponentRef<typeof WheelPickerBar>>,
    barProps?: WheelPickerBarProps,
  }

function WheelPickerComponent<T>({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  onLoop,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  isLooping,
  visibleRows,
  children,
  rootRef,
  rootProps,
  barRef,
  barProps,
}: WheelPickerProps<T>) {
  const [state, setState] = useControlledState<WheelPickerState<T>>({
    defaultValue: { value: initialValue },
  })
  const valueBinding = useStateMachineBinding<WheelPickerState<T>, T | undefined>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: T | undefined) => ({ value: next }), []),
    get: useCallback((current: WheelPickerState<T>) => current.value, []),
  })
  const handleStateEvent = useCallback((event: WheelPickerEvent<T>) => {
    onStateEvent?.(event)
    if (event.type === 'loop') {
      onLoop?.(event)
    }
  }, [onLoop, onStateEvent])

  return (
    <WheelPickerStateManager
      state={valueBinding.state}
      onStateChange={valueBinding.onStateChange}
      onStateEvent={handleStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      isLooping={isLooping}
      visibleRows={visibleRows}
    >
      <WheelPickerRoot
        ref={ReactUtils.assingRefsBuilder([rootRef])}
        {...rootProps}
      >
        {children}
        <WheelPickerBar
          ref={ReactUtils.assingRefsBuilder([barRef])}
          {...barProps}
        />
      </WheelPickerRoot>
    </WheelPickerStateManager>
  )
}

export const WheelPicker = Object.assign(WheelPickerComponent, {
  StateManager: WheelPickerStateManager,
  Root: WheelPickerRoot,
  Option: WheelPickerOption,
  Bar: WheelPickerBar,
  Context: WheelPickerContext,
  Provider: WheelPickerContext.Provider,
  Consumer: WheelPickerContext.Consumer,
})
