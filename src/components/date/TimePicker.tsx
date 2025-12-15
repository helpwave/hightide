import { useEffect, useRef } from 'react'
import { closestMatch, range } from '@/src/utils/array'
import clsx from 'clsx'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { Button } from '@/src/components/user-action/Button'

type MinuteIncrement = '1min' | '5min' | '10min' | '15min' | '30min'

export type TimePickerProps = {
  time?: Date,
  onChange?: (time: Date) => void,
  is24HourFormat?: boolean,
  minuteIncrement?: MinuteIncrement,
  maxHeight?: number,
  className?: string,
}

export const TimePicker = ({
                             time = new Date(),
                             onChange,
                             is24HourFormat = true,
                             minuteIncrement = '5min',
                             maxHeight = 280,
                             className = ''
                           }: TimePickerProps) => {
  const minuteRef = useRef<HTMLButtonElement>(null)
  const hourRef = useRef<HTMLButtonElement>(null)

  const isPM = time.getHours() >= 11
  const hours = is24HourFormat ? range(24) : range(12)
  let minutes = range(60)

  useEffect(() => {
    const scrollToItem = () => {
      if (minuteRef.current) {
        const container = minuteRef.current.parentElement!

        const hasOverflow = container.scrollHeight > maxHeight
        if (hasOverflow) {
          minuteRef.current.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
          })
        }
      }
    }
    scrollToItem()
  }, [minuteRef, minuteRef.current]) // eslint-disable-line

  useEffect(() => {
    const scrollToItem = () => {
      if (hourRef.current) {
        const container = hourRef.current.parentElement!

        const hasOverflow = container.scrollHeight > maxHeight
        if (hasOverflow) {
          hourRef.current.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
          })
        }
      }
    }
    scrollToItem()
  }, [hourRef, hourRef.current]) // eslint-disable-line

  switch (minuteIncrement) {
    case '5min':
      minutes = minutes.filter(value => value % 5 === 0)
      break
    case '10min':
      minutes = minutes.filter(value => value % 10 === 0)
      break
    case '15min':
      minutes = minutes.filter(value => value % 15 === 0)
      break
    case '30min':
      minutes = minutes.filter(value => value % 30 === 0)
      break
  }

  const closestMinute = closestMatch(minutes, (item1, item2) => Math.abs(item1 - time.getMinutes()) < Math.abs(item2 - time.getMinutes()))

  const onChangeWrapper = (transformer: (newDate: Date) => void) => {
    const newDate = new Date(time)
    transformer(newDate)
    onChange?.(newDate)
  }

  return (
    <div className={clsx('flex-row-2 w-fit min-w-[150px] select-none overflow-hidden', className)}>
      <div className="flex-col-1 h-full overflow-y-auto min-w-16">
        {hours.map(hour => {
          const isSelected = hour === time.getHours() - (!is24HourFormat && isPM ? 12 : 0)
          return (
            <Button
              size="small"
              color={isSelected ? 'primary' : 'neutral'}
              key={hour}
              ref={isSelected ? hourRef : undefined}
              onClick={() => onChangeWrapper(newDate => newDate.setHours(hour + (!is24HourFormat && isPM ? 12 : 0)))}
            >
              {hour.toString().padStart(2, '0')}
            </Button>
          )
        })}
      </div>
      <div className="flex-col-1 h-full overflow-y-auto min-w-16">
        {minutes.map(minute => {
          const isSelected = minute === closestMinute
          return (
            <Button
              size="small"
              color={isSelected ? 'primary' : 'neutral'}
              key={minute + minuteIncrement} // minute increment so that scroll works
              ref={isSelected ? minuteRef : undefined}
              onClick={() => onChangeWrapper(newDate => newDate.setMinutes(minute))}
            >
              {minute.toString().padStart(2, '0')}
            </Button>
          )
        })}
      </div>
      {!is24HourFormat && (
        <div className="flex-col-1 min-w-16">
          <Button
            size="small"
            color={!isPM ? 'primary' : 'neutral'}
            onClick={() => onChangeWrapper(newDate => isPM && newDate.setHours(newDate.getHours() - 12))}
          >
            AM
          </Button>
          <Button
            size="small"
            color={isPM ? 'primary' : 'neutral'}
            onClick={() => onChangeWrapper(newDate => !isPM && newDate.setHours(newDate.getHours() + 12))}
          >
            PM
          </Button>
        </div>
      )}
    </div>
  )
}

export const TimePickerUncontrolled = ({
                                         time,
                                         onChange,
                                         ...props
                                       }: TimePickerProps) => {
  const [value, setValue] = useOverwritableState(time, onChange)

  return (
    <TimePicker
      {...props}
      time={value}
      onChange={setValue}
    />
  )
}
