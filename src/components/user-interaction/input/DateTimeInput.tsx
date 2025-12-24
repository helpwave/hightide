import type { HTMLAttributes } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import clsx from 'clsx'
import type { InputProps } from '@/src/components/user-interaction/input/Input'
import { Input } from '@/src/components/user-interaction/input/Input'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { useLocale } from '@/src/contexts/LocaleContext'
import { useOutsideClick } from '@/src/hooks/useOutsideClick'
import { useZIndexRegister } from '@/src/hooks/useZIndexRegister'
import type { DateTimePickerProps } from '@/src/components/user-interaction/date/DateAndTimePicker'
import { DateTimePicker } from '@/src/components/user-interaction/date/DateAndTimePicker'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Visibility } from '@/src/components/layout/Visibility'
import { DateUtils } from '@/src/utils/date'

export type DateTimeInputProps = Omit<InputProps, 'onEditCompleted'> & {
  date?: Date,
  onValueChange?: (date: Date) => void,
  onEditCompleted?: (date: Date) => void,
  onRemove?: () => void,
  mode?: 'date' | 'dateTime',
  containerProps?: HTMLAttributes<HTMLDivElement>,
  pickerProps?: Omit<DateTimePickerProps, 'mode' | 'value' | 'onChange'>,
}

export const DateTimeInput = ({
  date,
  onValueChange,
  onEditCompleted,
  onRemove,
  containerProps,
  mode = 'date',
  pickerProps,
  ...props
}: DateTimeInputProps) => {
  const translation = useHightideTranslation()
  const { locale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)


  const containerRef = useRef<HTMLDivElement>(null)

  useOutsideClick([containerRef], () => {
    setIsOpen(false)
  })

  const zIndex = useZIndexRegister(isOpen)

  const isReadOnly = useMemo(() => props.readOnly || props.disabled, [props.readOnly, props.disabled])

  useEffect(() => {
    if (isReadOnly) {
      setIsOpen(false)
    }
  }, [isReadOnly])

  const cleanInputProps = { ...props } as Omit<typeof props, 'isShowingError' | 'setIsShowingError'> & Record<string, unknown>
  delete (cleanInputProps as Record<string, unknown>)['isShowingError']
  delete (cleanInputProps as Record<string, unknown>)['setIsShowingError']

  return (
    <>
      <div {...containerProps} className={clsx('relative w-full', containerProps?.className)}>
        <Input
          {...cleanInputProps}
          placeholder={translation('clickToSelect')}
          value={date ? DateUtils.formatAbsolute(date, locale, mode === 'dateTime') : ''}
          onClick={(event) => {
            setIsOpen(true)
            cleanInputProps.onClick?.(event)
          }}
          readOnly={true}
          className={clsx(
            'pr-10 w-full',
            { 'hover:cursor-pointer': !isReadOnly },
            cleanInputProps.className
          )}
        />
        <Button
          coloringStyle="text" layout="icon" color="neutral" size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          disabled={isReadOnly}
          onClick={() => setIsOpen(prevState => !prevState)}
        >
          <CalendarIcon className="size-5"/>
        </Button>
      </div>
      <Visibility isVisible={isOpen}>
        <div
          ref={containerRef}
          className="absolute left-0 flex-col-3 rounded-lg shadow-xl border bg-surface-variant text-on-surface border-divider p-2"
          style={{ zIndex }}
        >
          <DateTimePicker
            {...pickerProps}
            mode={mode}
            value={date}
            onValueChange={(newDate) => {
              onValueChange(newDate)
            }}
          />
          <div className="flex-row-2 justify-end">
            <Visibility isVisible={!!onRemove}>
              <Button
                size="md"
                color="negative"
                onClick={() => {
                  onRemove?.()
                  setIsOpen(false)
                }}
              >
                {translation('clear')}
              </Button>
            </Visibility>
            <Button
              size="md"
              onClick={() => {
                onEditCompleted?.(date)
                setIsOpen(false)
              }}
            >
              {translation('change')}
            </Button>
          </div>
        </div>
      </Visibility>
    </>
  )
}

export const DateTimeInputUncontrolled = ({
  date: initialDate,
  ...props
}: DateTimeInputProps) => {
  const [date, setDate] = useOverwritableState<Date>(initialDate)

  return (
    <DateTimeInput
      {...props}
      date={date}
      onValueChange={(newDate) => {
        setDate(newDate)
        props.onValueChange?.(newDate)
      }}
      onRemove={() => {
        setDate(undefined)
        props.onRemove?.()
      }}
    />
  )
}
