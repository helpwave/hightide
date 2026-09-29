import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ArrowLeft, Trash } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import { Visibility } from '../../layout/Visibility'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { DateWheelPicker } from './DateWheelPicker'
import { type DateTimeWheelPickerProps } from './DateTimeWheelPicker'
import { TimeWheelPicker } from './TimeWheelPicker'
import type { FormFieldDataHandling } from '../../form/FormField'
import type { DateTimeFormat, Weekday } from '@helpwave/hightide-utils/utils'
import clsx from 'clsx'

export interface DateTimePickerDialogProps extends
HTMLAttributes<HTMLDivElement>,
Partial<FormFieldDataHandling<Date | null>>,
Pick<DateTimeWheelPickerProps, 'start' | 'end' | 'isLooping' | 'loopingBehaviour' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>
{
  initialValue?: Date | null,
  allowRemove?: boolean,
  weekStart?: Weekday,
  markToday?: boolean,
  pickerProps?: Omit<DateTimeWheelPickerProps, 'value' | 'onValueChange' | 'onEditComplete' | 'initialValue' | 'start' | 'end' | 'isLooping' | 'loopingBehaviour' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>,
  mode?: DateTimeFormat,
  label?: ReactNode,
  labelId?: string,
}

type DialogStep = 'date' | 'time'

export const DateTimePickerDialog = ({
  initialValue = null,
  value,
  allowRemove = true,
  onValueChange,
  onEditComplete,
  mode = 'date',
  pickerProps = {},
  start,
  end,
  weekStart: _weekStart,
  markToday: _markToday,
  isLooping,
  loopingBehaviour,
  is24HourFormat,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  precision,
  labelId,
  label,
  ...props
}: DateTimePickerDialogProps) => {
  const translation = useHightideTranslation()
  const [state, setState] = useControlledState({
    value,
    onValueChange,
    defaultValue: initialValue
  })
  const [pickerState, setPickerState] = useState(state ?? new Date())
  const [step, setStep] = useState<DialogStep>('date')
  const [compact, setCompact] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const pairRef = useRef<HTMLDivElement>(null)
  const compactRef = useRef(false)
  const neededWidthRef = useRef(0)

  useEffect(() => {
    setPickerState(state ?? new Date())
  }, [state])

  useLayoutEffect(() => {
    if (mode !== 'dateTime') {
      compactRef.current = false
      setCompact(false)
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
      const next = neededWidthRef.current > 0 && available < neededWidthRef.current
      if (next === compactRef.current) {
        return
      }
      compactRef.current = next
      setCompact(next)
      if (next) {
        setStep('date')
      }
    }

    update(availableWidth())
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      update(width ?? availableWidth())
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [mode, compact])

  const splitSteps = mode === 'dateTime' && compact
  const showDate = mode !== 'time' && (!splitSteps || step === 'date')
  const showTime = mode !== 'date' && (!splitSteps || step === 'time')

  const clearValue = () => {
    setState(null)
    onEditComplete?.(null)
  }

  const finish = () => {
    if (splitSteps && step === 'date') {
      setStep('time')
      return
    }
    onEditComplete?.(pickerState)
  }

  return (
    <div
      {...props}
      ref={rootRef}
      className={clsx('date-time-picker-dialog', props?.className)}
      data-compact={compact ? '' : undefined}
      data-step={splitSteps ? step : undefined}
    >
      <div className="date-time-picker-dialog-header">
        <span
          id={labelId}
          className="date-time-picker-dialog-label"
        >
          {label ?? translation('sDateTimeSelect', { datetimeMode: mode })}
        </span>
        <Visibility isVisible={allowRemove && !!state}>
          <IconButton
            className="date-time-picker-dialog-clear"
            tooltip={translation('clear')}
            variant="foreground"
            size="sm"
            icon={Trash}
            onClick={clearValue}
          />
        </Visibility>
      </div>
      <div ref={pairRef} className={clsx('date-time-picker-dialog-pair', pickerProps.className)}>
        {showDate && (
          <DateWheelPicker
            value={pickerState}
            onValueChange={setPickerState}
            onEditComplete={setPickerState}
            start={start}
            end={end}
            isLooping={isLooping}
            loopingBehaviour={loopingBehaviour}
          />
        )}
        {showTime && (
          <TimeWheelPicker
            value={pickerState}
            onValueChange={setPickerState}
            onEditComplete={setPickerState}
            isLooping={isLooping}
            loopingBehaviour={loopingBehaviour}
            is24HourFormat={is24HourFormat}
            minuteIncrement={minuteIncrement}
            secondIncrement={secondIncrement}
            millisecondIncrement={millisecondIncrement}
            precision={precision}
          />
        )}
      </div>
      <div className="date-time-picker-dialog-actions">
        {splitSteps ? (
          <IconButton
            tooltip={translation('previous')}
            variant="foreground"
            icon={ArrowLeft}
            disabled={step === 'date'}
            onClick={() => setStep('date')}
          />
        ) : (
          <Visibility isVisible={!state}>
            <Button
              size="md"
              color="neutral"
              onClick={() => {
                setState(state)
                onEditComplete?.(state)
              }}
              className="date-time-picker-dialog-action"
            >
              {translation('cancel')}
            </Button>
          </Visibility>
        )}
        <Button
          size="md"
          onClick={finish}
          className="date-time-picker-dialog-action"
        >
          {translation('done')}
        </Button>
      </div>
    </div>
  )
}
