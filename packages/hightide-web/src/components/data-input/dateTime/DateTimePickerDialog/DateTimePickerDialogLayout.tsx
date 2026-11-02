import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { DateTimePickerDialogChromeContext, useDateTimePickerDialogContext } from './DateTimePickerDialogContext'

export type DateTimePickerDialogLayoutProps = HTMLAttributes<HTMLDivElement>

export const DateTimePickerDialogLayout = forwardRef<HTMLDivElement, DateTimePickerDialogLayoutProps>(function DateTimePickerDialogLayout(
  { children, ...props },
  forwardedRef
) {
  const { state, dispatch, config } = useDateTimePickerDialogContext()
  const [isCompact, setIsCompact] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const pairRef = useRef<HTMLDivElement>(null)
  const compactRef = useRef(false)
  const neededWidthRef = useRef(0)

  useLayoutEffect(() => {
    if (config.mode !== 'dateTime') {
      compactRef.current = false
      setIsCompact(false)
      return
    }
    const root = rootRef.current
    const pair = pairRef.current
    if (!root || !pair) {
      return
    }

    const availableWidth = () => {
      const style = getComputedStyle(root)
      return root.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
    }

    const update = (available: number) => {
      if (!compactRef.current) {
        neededWidthRef.current = pair.scrollWidth
      }
      const isNextCompact = neededWidthRef.current > 0 && available < neededWidthRef.current
      if (isNextCompact === compactRef.current) {
        return
      }
      compactRef.current = isNextCompact
      setIsCompact(isNextCompact)
      if (isNextCompact) {
        dispatch({ type: 'setStep', step: 'date' })
      }
    }

    update(availableWidth())
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      update(width ?? availableWidth())
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [config.mode, dispatch, isCompact])

  const isSplit = config.mode === 'dateTime' && isCompact

  return (
    <DateTimePickerDialogChromeContext.Provider value={{ isCompact, isSplit, pairRef }}>
      <div
        {...props}
        ref={ReactUtils.assingRefsBuilder([forwardedRef, rootRef])}
        className={clsx('date-time-picker-dialog', props.className)}
        data-compact={isCompact ? '' : undefined}
        data-step={isSplit ? state.step : undefined}
      >
        {children}
      </div>
    </DateTimePickerDialogChromeContext.Provider>
  )
})
