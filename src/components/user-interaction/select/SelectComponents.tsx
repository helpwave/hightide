import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, RefObject } from 'react'
import type { SelectIconAppearance } from './SelectContext'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useSelectContext } from './SelectContext'
import clsx from 'clsx'
import { CheckIcon } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { PopUp, type PopUpProps } from '../../layout/popup/PopUp'

//
// SelectOption
//
export type SelectOptionProps = Omit<HTMLAttributes<HTMLLIElement>, 'children'> & {
    value: string,
    disabled?: boolean,
    iconAppearance?: SelectIconAppearance,
    children?: ReactNode,
  }

export const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps>(
  function SelectOption({ children, value, disabled = false, iconAppearance, className, ...restProps }, ref) {
    const { state, config, item, trigger } = useSelectContext()
    const { register, unregister, toggleSelection, highlightItem } = item
    const itemRef = useRef<HTMLLIElement>(null)

    iconAppearance ??= config.iconAppearance

    const label = children ?? value

    // Register with parent
    useEffect(() => {
      register({
        value,
        label,
        disabled,
        ref: itemRef,
      })
      return () => unregister(value)
    }, [value, disabled, register, unregister, children, label])

    const isHighlighted = state.highlightedValue === value
    const isSelected = state.value.includes(value)

    return (
      <li
        {...restProps}
        ref={(node) => {
          itemRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node
        }}
        id={value}
        role="option"
        aria-disabled={disabled}
        aria-selected={isSelected}
        data-highlighted={isHighlighted ? '' : undefined}
        data-selected={isSelected ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={clsx(
          'flex-row-1 items-center px-2 py-1 rounded-md',
          'data-highlighted:bg-primary/20',
          'data-disabled:text-disabled data-disabled:cursor-not-allowed',
          'not-data-disabled:cursor-pointer',
          className
        )}
        onClick={(event) => {
          if (!disabled) {
            toggleSelection(value)
            if (!config.isMultiSelect) {
              trigger.toggleOpen(false)
            }
            restProps.onClick?.(event)
          }
        }}
        onMouseEnter={(event) => {
          if (!disabled) {
            highlightItem(value)
            restProps.onMouseEnter?.(event)
          }
        }}
      >
        {iconAppearance === 'left' && (state.value.length > 0 || config.isMultiSelect) && (
          <CheckIcon
            className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
            aria-hidden={true}
          />
        )}
        {label}
        {iconAppearance === 'right' && (state.value.length > 0 || config.isMultiSelect) && (
          <CheckIcon
            className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
            aria-hidden={true}
          />
        )}
      </li>
    )
  }
)

///
/// SelectButton
///
export type SelectButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  placeholder?: ReactNode,
  selectedDisplay?: (value: string[]) => ReactNode,
}

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(function SelectButton({
  id,
  placeholder,
  selectedDisplay,
  ...props
}, ref) {
  const translation = useHightideTranslation()
  const { state, trigger, setIds, ids } = useSelectContext()
  const { register, unregister, toggleOpen } = trigger

  useEffect(() => {
    if(id) {
      setIds(prev => ({
        ...prev,
        trigger: id,
      }))
    }
  }, [id, setIds])
  const innerRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => innerRef.current)

  useEffect(() => {
    register(innerRef)
    return () => unregister()
  }, [register, unregister])

  const disabled = !!props?.disabled || !!state.disabled
  const invalid = state.invalid
  const hasValue = state.value.length > 0

  return (
    <button
      {...props}
      ref={innerRef}
      id={ids.trigger}
      disabled={disabled}
      type="button"

      onClick={(event) => {
        props.onClick?.(event)
        toggleOpen(!state.isOpen)
      }}
      onKeyDown={event => {
        props.onKeyDown?.(event)
        switch (event.key) {
        case 'ArrowDown':
          toggleOpen(true, { highlightStartPositionBehavior: 'first' })
          event.preventDefault()
          event.stopPropagation()
          break
        case 'ArrowUp':
          toggleOpen(true, { highlightStartPositionBehavior: 'last' })
          event.preventDefault()
          event.stopPropagation()
          break
        }
      }}

      data-name={props['data-name'] ?? 'select-button'}
      data-value={hasValue ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}

      aria-invalid={invalid}
      aria-disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={state.isOpen}
      aria-controls={state.isOpen ? ids.content : undefined}
    >
      {hasValue ?
        selectedDisplay?.(state.value) ?? (
          <div className={clsx('flex flex-wrap gap-x-1 gap-y-2')}>
            {state.selectedOptions.map(({ value, label }, index) => (
              <span key={value} className="flex-row-0">
                {label}
                {index < state.value.length - 1 && (<span>{','}</span>)}
              </span>
            ))}
          </div>
        )
        : placeholder ?? translation('clickToSelect')
      }
      <ExpansionIcon isExpanded={state.isOpen}/>
    </button>
  )
})

///
/// SelectContent
///
export type SelectContentProps = PopUpProps

export const SelectContent = forwardRef<HTMLUListElement, SelectContentProps>(function SelectContent({
  id,
  options,
  ...props
}, ref) {
  const innerRef = useRef<HTMLUListElement>(null)
  useImperativeHandle(ref, () => innerRef.current)

  const { trigger, state, config, item, ids, setIds } = useSelectContext()

  useEffect(() => {
    if(id) {
      setIds(prev => ({
        ...prev,
        content: id,
      }))
    }
  }, [id, setIds])

  return (
    <PopUp
      {...props}
      id={ids.content}
      isOpen={state.isOpen}
      anchor={trigger.ref}
      options={options}
      forceMount={true}
      onClose={() => {
        trigger.toggleOpen(false)
        props.onClose?.()
      }}

      aria-labelledby={ids.trigger}
    >
      <ul
        ref={innerRef}
        onKeyDown={(event) => {
          switch (event.key) {
          case 'ArrowDown':
            item.moveHighlightedIndex(1)
            event.preventDefault()
            break
          case 'ArrowUp':
            item.moveHighlightedIndex(-1)
            event.preventDefault()
            break
          case 'Home':
            // TODO support later by selecting the first not disabled entry
            event.preventDefault()
            break
          case 'End':
            // TODO support later by selecting the last not disabled entry
            event.preventDefault()
            break
          case 'Enter': // Fall through
          case ' ':
            if (state.highlightedValue) {
              item.toggleSelection(state.highlightedValue)
              if (!config.isMultiSelect) {
                trigger.toggleOpen(false)
              }
              event.preventDefault()
            }
            break
          }
        }}

        className={clsx('flex-col-0 p-2 bg-menu-background text-menu-text rounded-md shadow-hw-bottom focus-outline-within overflow-auto', props.className)}

        role="listbox"
        aria-multiselectable={config.isMultiSelect}
        aria-orientation="vertical"
        tabIndex={0}
      >
        {props.children}
      </ul>
    </PopUp>
  )
})

///
/// MultiSelectOption
///
export type MultiSelectOptionProps = SelectOptionProps

export const MultiSelectOption = SelectOption


///
/// MultiSelectContent
///
export type MultiSelectContentProps = SelectContentProps

export const MultiSelectContent = SelectContent

///
/// MultiSelectButton
///
export type MultiSelectButtonProps = SelectButtonProps

export const MultiSelectButton = SelectButton
