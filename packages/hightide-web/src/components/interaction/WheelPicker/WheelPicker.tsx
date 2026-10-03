import type { ReactElement, ReactNode } from 'react'
import clsx from 'clsx'

import type { WheelPickerBarProps } from './WheelPickerBar'
import { WheelPickerBar } from './WheelPickerBar'
import { WheelPickerContext } from './WheelPickerContext'
import type { WheelPickerOptionProps } from './WheelPickerOption'
import { WheelPickerOption } from './WheelPickerOption'
import type { WheelPickerLoopEvent, WheelPickerRootProps } from './WheelPickerRoot'
import { WheelPickerRoot } from './WheelPickerRoot'

export type WheelPickerProps<T> = Omit<WheelPickerRootProps<T>, 'children'> & {
  children?: ReactNode,
  rootProps?: Omit<WheelPickerRootProps<T>, 'children'>,
  barProps?: WheelPickerBarProps,
}

type WheelPickerComponent = <T>(props: WheelPickerProps<T>) => ReactElement | null

function WheelPickerComponentImpl<T>({
  children,
  className,
  rootProps,
  barProps,
  ...props
}: WheelPickerProps<T>) {
  return (
    <WheelPickerRoot
      {...props}
      {...rootProps}
      className={clsx(className, rootProps?.className)}
    >
      {children}
      <WheelPickerBar {...barProps} />
    </WheelPickerRoot>
  )
}

const WheelPicker = Object.assign(WheelPickerComponentImpl as WheelPickerComponent, {
  Root: WheelPickerRoot,
  Option: WheelPickerOption,
  Bar: WheelPickerBar,
  Context: WheelPickerContext,
  Consumer: WheelPickerContext.Consumer,
})

export { WheelPicker }
export type { WheelPickerLoopEvent, WheelPickerOptionProps, WheelPickerRootProps, WheelPickerBarProps }
