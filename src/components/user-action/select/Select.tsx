import type { HtmlHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useImperativeHandle } from 'react'
import { useRef } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { formTranslation } from '@/src/localization/defaults/form'
import { useTranslation } from '@/src/localization/useTranslation'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { ExpansionIcon } from '@/src/components/layout-and-navigation/Expandable'
import type { ListBoxProps } from '@/src/components/layout-and-navigation/ListBox'
import { ListBox } from '@/src/components/layout-and-navigation/ListBox'
import type { FloatingContainerProps } from '@/src/components/layout-and-navigation/FloatingContainer'
import { FloatingContainer } from '@/src/components/layout-and-navigation/FloatingContainer'

export type SelectProps = Omit<HtmlHTMLAttributes<HTMLButtonElement>, 'onChange'> &
  Pick<FloatingContainerProps, 'gap' | 'horizontalAlignment' | 'verticalAlignment' | 'className'> &
  Pick<ListBoxProps, 'value' | 'options' | 'direction'> &
  {
    disabled?: boolean,
    onChange?: (value: string) => void,
    invalid?: boolean,
    placeholder?: ReactNode,
    contentClassName?: string,
  };

type OpenState = {
  open: boolean,
  startIndex?: number,
}

/**
 * A Select Component for selecting form a list of options
 *
 * The State is managed by the parent
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select({
                                                                                   id: userId,
                                                                                   value,
                                                                                   options,
                                                                                   onChange,
                                                                                   placeholder,
                                                                                   contentClassName,
                                                                                   horizontalAlignment = 'center',
                                                                                   verticalAlignment = 'afterEnd',
                                                                                   gap,
                                                                                   direction,
                                                                                   ...props
                                                                                 }, forwardRef) {
  const translation = useTranslation([formTranslation])
  const [openState, setOpenState] = useState<OpenState>({ open: false })
  const triggerRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(forwardRef, () => triggerRef.current)
  const listBoxRef = useRef<HTMLUListElement | null>(null)

  const generatedId = useId()
  const id = generatedId ?? userId

  const selectedOption = options.find(option => option.value === value)
  useLogOnce(
    'The selected value is not found in the options list.',
    value !== undefined && selectedOption === undefined
  )


  return (
    <>
      <button
        id={id}
        ref={triggerRef}
        {...props}
        className={clsx(
          'flex-row-4 items-center justify-between bg-input-background text-input-text rounded-md px-2.5 py-2.5',
          'data-placeholder:text-description',
          props.className
        )}
        data-placeholder={!value ? '' : undefined}
        onClick={() => setOpenState(({ open }) => ({ open: !open }))}
        onKeyDown={event => {
          switch (event.key) {
            case 'ArrowDown':
              setOpenState({ open: true, startIndex: 0 })
              break
            case 'ArrowUp':
              setOpenState({ open: true, startIndex: options.length - 1 })
          }
        }}

        aria-haspopup="listbox"
        aria-expanded={openState.open}
        aria-controls={openState.open ? `${id}-listbox` : undefined}
      >
        {selectedOption?.display ?? selectedOption?.value ?? placeholder ?? `${translation('select')}...`}
        <ExpansionIcon isExpanded={openState.open}/>
      </button>
      {openState.open && (
        <FloatingContainer
          id={`${id}-listbox`}
          verticalAlignment={verticalAlignment}
          horizontalAlignment={horizontalAlignment}
          gap={gap}
          isFocusTrap={true}
          anchor={triggerRef}
          className={clsx('flex-col-0 py-2 bg-menu-background text-menu-text rounded-md shadow-hw-bottom', contentClassName)}
          isFocusingFirst={true}
        >
          <ListBox
            ref={listBoxRef}
            value={value}
            options={options}
            startIndex={openState.startIndex}
            onSelectionChanged={value => {
              onChange?.(value)
              setOpenState({ open: false })
            }}
            isSelection={true}
            onKeyDown={event => {
              switch (event.key) {
                case 'Escape':
                  setOpenState({ open: false })
              }
            }}
            direction={direction}
            className="focus-visible:ring-0 px-2 overflow-auto"

            aria-labelledby={id}
          />
        </FloatingContainer>
      )}
    </>
  )
})

export const SelectUncontrolled = ({
                                     options, onChange, value: initialValue, ...props
                                   }: SelectProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Select
      value={value}
      options={options}
      onChange={(value) => {
        onChange?.(value)
        setValue(value)
      }}
      {...props}
    />
  )
}