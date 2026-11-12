import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { forwardRef, useMemo } from 'react'
import clsx from 'clsx'

import { useWheelPickerContext, WheelPickerContext, type WheelPickerContextValue } from './WheelPickerContext'

export type WheelPickerLoopPreviewProps = HTMLAttributes<HTMLDivElement> & {
  placement?: 'start' | 'end',
  children?: ReactNode,
}

export const WheelPickerLoopPreview = forwardRef(function WheelPickerLoopPreview({
  placement = 'start',
  className,
  children,
  ...props
}: WheelPickerLoopPreviewProps, forwardedRef: Ref<HTMLDivElement>) {
  const context = useWheelPickerContext<unknown>()
  const previewContext = useMemo<WheelPickerContextValue<unknown>>(() => ({
    ...context,
    isPreview: true,
  }), [context])

  return (
    <WheelPickerContext.Provider value={previewContext}>
      <div
        {...props}
        ref={forwardedRef}
        aria-hidden
        className={clsx(
          'wheel-picker-loop-preview',
          placement === 'end' && 'wheel-picker-loop-preview-end',
          className
        )}
      >
        {children}
      </div>
    </WheelPickerContext.Provider>
  )
})
