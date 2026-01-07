import type { HTMLAttributes } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import clsx from 'clsx'
import type { InputProps } from '@/src/components/user-interaction/input/Input'
import { Input } from '@/src/components/user-interaction/input/Input'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { useLocale } from '@/src/contexts/LocaleContext'
import { useOutsideClick } from '@/src/hooks/useOutsideClick'
import type { DateTimePickerProps } from '@/src/components/user-interaction/date/DateTimePicker'
import { DateTimePicker } from '@/src/components/user-interaction/date/DateTimePicker'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Visibility } from '@/src/components/layout/Visibility'
import { DateUtils } from '@/src/utils/date'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import type { FormFieldDataHandling } from '../../form/FormField'

export type DateTimeInputProps = Omit<InputProps, keyof FormFieldDataHandling<string>>
& Partial<FormFieldDataHandling<Date>>
& {
  onRemove?: () => void,
  // TODO allow mode = time
  mode?: 'date' | 'dateTime',
  containerProps?: HTMLAttributes<HTMLDivElement>,
  pickerProps?: Omit<DateTimePickerProps, keyof FormFieldDataHandling<Date> | 'mode'>,
}

export const DateTimeInput = ({
  value,
  onValueChange,
  onEditComplete,
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
    onEditComplete(value)
  })

  const { zIndex } = useOverlayRegistry({ isActive: isOpen })

  const isReadOnly = useMemo(() => props.readOnly || props.disabled, [props.readOnly, props.disabled])

  useEffect(() => {
    if (isReadOnly) {
      setIsOpen(false)
    }
  }, [isReadOnly])

  return (
    <>
      <div {...containerProps} className={clsx('relative w-full', containerProps?.className)}>
        <Input
          {...props}
          placeholder={translation('clickToSelect')}
          value={value ? DateUtils.formatAbsolute(value, locale, mode === 'dateTime') : ''}
          onClick={(event) => {
            setIsOpen(true)
            props.onClick?.(event)
          }}
          readOnly={true}
          className={clsx(
            'pr-10 w-full',
            { 'hover:cursor-pointer': !isReadOnly },
            props.className
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
            value={value}
            onValueChange={onValueChange}
            onEditComplete={onEditComplete}
          />
          <div className="flex-row-2 justify-end">
            <Visibility isVisible={!!onRemove && !!value}>
              <Button
                size="md"
                color="negative"
                onClick={() => {
                  onRemove?.()
                  setIsOpen(false)
                }}
                className="min-w-26"
              >
                {translation('clear')}
              </Button>
            </Visibility>
            <Visibility isVisible={!value}>
              <Button
                size="md"
                color="neutral"
                onClick={() => setIsOpen(false)}
                className="min-w-26"
              >
                {translation('cancel')}
              </Button>
            </Visibility>
            <Button
              size="md"
              onClick={() => {
                onEditComplete?.(value)
                setIsOpen(false)
              }}
              className="min-w-26"
            >
              {translation('done')}
            </Button>
          </div>
        </div>
      </Visibility>
    </>
  )
}

export const DateTimeInputUncontrolled = ({
  value: initialValue,
  ...props
}: DateTimeInputProps) => {
  const [value, setValue] = useOverwritableState<Date | undefined>(initialValue)

  return (
    <DateTimeInput
      {...props}
      value={value}
      onValueChange={(newDate) => {
        setValue(newDate)
        props.onValueChange?.(newDate)
      }}
      onRemove={() => {
        setValue(undefined)
        props.onRemove?.()
      }}
    />
  )
}
