import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { WheelPickerBar, type WheelPickerBarProps } from './WheelPickerBar'
import { WheelPickerBarLine } from './WheelPickerBarLine'
import { WheelPickerContext } from './WheelPickerContext'
import { WheelPickerItems, type WheelPickerItemsProps } from './WheelPickerItems'
import { WheelPickerLayout, type WheelPickerLayoutProps } from './WheelPickerLayout'
import { WheelPickerLoopPreview } from './WheelPickerLoopPreview'
import { WheelPickerOption } from './WheelPickerOption'
import { WheelPickerStateManager, type WheelPickerStateManagerProps } from './WheelPickerStateManager'

export type WheelPickerProps<T> = Omit<WheelPickerStateManagerProps<T>, 'children'> & {
  layoutRef?: Ref<ComponentRef<typeof WheelPickerLayout>>,
  layoutProps?: WheelPickerLayoutProps,
  itemsRef?: Ref<ComponentRef<typeof WheelPickerItems>>,
  itemsProps?: WheelPickerItemsProps,
  barRef?: Ref<ComponentRef<typeof WheelPickerBar>>,
  barProps?: WheelPickerBarProps,
}

function WheelPickerComponent<T>({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  onLoop,
  options,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  isLooping,
  visibleRows,
  layoutRef,
  layoutProps,
  itemsRef,
  itemsProps,
  barRef,
  barProps,
}: WheelPickerProps<T>) {
  return (
    <WheelPickerStateManager
      state={state}
      value={value}
      initialValue={initialValue}
      onValueChange={onValueChange}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      onLoop={onLoop}
      options={options}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      isLooping={isLooping}
      visibleRows={visibleRows}
    >
      <WheelPickerLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <WheelPickerItems
          {...itemsProps}
          ref={ReactUtils.assingRefsBuilder([itemsRef])}
        />
        <WheelPickerBar
          {...barProps}
          ref={ReactUtils.assingRefsBuilder([barRef])}
        />
      </WheelPickerLayout>
    </WheelPickerStateManager>
  )
}

export const WheelPicker = Object.assign(WheelPickerComponent, {
  StateManager: WheelPickerStateManager,
  Layout: WheelPickerLayout,
  Items: WheelPickerItems,
  LoopPreview: WheelPickerLoopPreview,
  Option: WheelPickerOption,
  Bar: WheelPickerBar,
  BarLine: WheelPickerBarLine,
  Context: WheelPickerContext,
  Provider: WheelPickerContext.Provider,
  Consumer: WheelPickerContext.Consumer,
})
