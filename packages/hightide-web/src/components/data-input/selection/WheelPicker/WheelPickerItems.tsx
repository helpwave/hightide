import type { HTMLAttributes, Ref } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

import { useWheelPickerContext } from './WheelPickerContext'
import { WheelPickerLoopPreview } from './WheelPickerLoopPreview'
import { WheelPickerOption } from './WheelPickerOption'
import { visibleRowSpan, wrappedOptions } from './wheelPickerMotion'

export type WheelPickerItemsProps = HTMLAttributes<HTMLDivElement>

export const WheelPickerItems = forwardRef(function WheelPickerItems({
  className,
  ...props
}: WheelPickerItemsProps, forwardedRef: Ref<HTMLDivElement>) {
  const { config, options, itemsRef } = useWheelPickerContext<unknown>()
  const isLooping = config.isLooping
  const rowSpan = visibleRowSpan(config.visibleRows)
  const previewCount = isLooping ? Math.ceil(rowSpan) : 0
  const leadingPreview = wrappedOptions(options, options.length - previewCount, previewCount)
  const trailingPreview = wrappedOptions(options, 0, previewCount)

  return (
    <div
      {...props}
      ref={ReactUtils.assingRefsBuilder([forwardedRef, itemsRef])}
      tabIndex={-1}
      className={clsx('wheel-picker-items', className)}
    >
      {isLooping && (
        <WheelPickerLoopPreview>
          {leadingPreview.map((option, index) => (
            <WheelPickerOption key={`leading-${option.id}-${index}`} option={option} />
          ))}
        </WheelPickerLoopPreview>
      )}
      {options.map((option) => (
        <WheelPickerOption key={option.id} option={option} />
      ))}
      {isLooping && (
        <WheelPickerLoopPreview placement="end">
          {trailingPreview.map((option, index) => (
            <WheelPickerOption key={`trailing-${option.id}-${index}`} option={option} />
          ))}
        </WheelPickerLoopPreview>
      )}
    </div>
  )
})
