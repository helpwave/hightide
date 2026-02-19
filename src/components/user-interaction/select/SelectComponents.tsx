import type { ButtonHTMLAttributes, ComponentProps, HTMLAttributes, ReactNode, RefObject } from 'react'
import type { SelectIconAppearance } from './SelectContext'
import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef } from 'react'
import { useSelectContext } from './SelectContext'
import clsx from 'clsx'
import { CheckIcon } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { PopUp, type PopUpProps } from '../../layout/popup/PopUp'
import { Input } from '@/src/components/user-interaction/input/Input'

export type SelectOptionDisplayLocation = 'trigger' | 'list'

const SelectOptionDisplayContext = createContext<SelectOptionDisplayLocation | null>(null)

export function useSelectOptionDisplayLocation(): SelectOptionDisplayLocation {
  const context = useContext(SelectOptionDisplayContext)
  if (!context) {
    throw new Error('useSelectOptionDisplayLocation must be used within a SelectOptionDisplayContext')
  }
  return context
}

//
// SelectOption
//
export interface SelectOptionProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
  value: string,
  label: string,
  disabled?: boolean,
  iconAppearance?: SelectIconAppearance,
  children?: ReactNode,
}

export const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps>(
  function SelectOption({ children, label, value, disabled = false, iconAppearance, className, ...restProps }, ref) {
    const { state, config, item, trigger } = useSelectContext()
    const { register, unregister, toggleSelection, highlightItem } = item
    const itemRef = useRef<HTMLLIElement>(null)

    iconAppearance ??= config.iconAppearance

    const display: ReactNode = children ?? label

    useEffect(() => {
      register({
        value,
        label,
        display,
        disabled,
        ref: itemRef,
      })
      return () => unregister(value)
    }, [value, label, disabled, register, unregister, display])

    const isHighlighted = state.highlightedValue === value
    const isSelected = state.value.includes(value)
    const isVisible = state.visibleOptions.some(opt => opt.value === value)

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
        aria-hidden={!isVisible}
        data-highlighted={isHighlighted ? '' : undefined}
        data-selected={isSelected ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-visible={isVisible ? '' : undefined}
        className={clsx(
          'flex-row-1 items-center px-2 py-1 rounded-md',
          'data-highlighted:bg-primary/20',
          'data-disabled:text-disabled data-disabled:cursor-not-allowed',
          'not-data-disabled:cursor-pointer',
          !isVisible && 'hidden',
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
        <SelectOptionDisplayContext.Provider value="list">
          {display}
        </SelectOptionDisplayContext.Provider>
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
  hideExpansionIcon?: boolean,
}

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(function SelectButton({
  id,
  placeholder,
  selectedDisplay,
  hideExpansionIcon = false,
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
      aria-haspopup="dialog"
      aria-expanded={state.isOpen}
      aria-controls={state.isOpen ? ids.content : undefined}
    >
      {hasValue ?
        selectedDisplay?.(state.value) ?? (
          <div className={clsx('flex flex-wrap gap-x-1 gap-y-2')}>
            {state.selectedOptions.map(({ value, display }, index) => (
              <span key={value} className="flex-row-0">
                <SelectOptionDisplayContext.Provider value="trigger">
                  {display}
                </SelectOptionDisplayContext.Provider>
                {index < state.value.length - 1 && (<span>{','}</span>)}
              </span>
            ))}
          </div>
        )
        : placeholder ?? translation('clickToSelect')
      }
      {!hideExpansionIcon && <ExpansionIcon isExpanded={state.isOpen}/>}
    </button>
  )
})

///
/// SelectContent
///
export type SelectContentProps = PopUpProps & {
  showSearch?: boolean,
  searchInputProps?: Omit<ComponentProps<typeof Input>, 'value' | 'onValueChange'>,
}

export const SelectContent = forwardRef<HTMLUListElement, SelectContentProps>(function SelectContent({
  id,
  options,
  showSearch: showSearchOverride,
  searchInputProps,
  ...props
}, ref) {
  const translation = useHightideTranslation()
  const innerRef = useRef<HTMLUListElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => innerRef.current)

  const { trigger, state, config, item, ids, setIds, search } = useSelectContext()

  useEffect(() => {
    if (id) {
      setIds(prev => ({
        ...prev,
        content: id,
      }))
    }
  }, [id, setIds])

  const showSearch = showSearchOverride ?? search.showSearch
  const listboxAriaLabel = showSearch ? translation('searchResults') : undefined

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
      <div className={clsx('flex flex-col', showSearch && 'gap-2')}>
        {showSearch && (
          <Input
            {...searchInputProps}
            ref={searchInputRef}
            id={ids.searchInput}
            value={search.searchQuery}
            onValueChange={search.setSearchQuery}
            placeholder={searchInputProps?.placeholder ?? translation('filterOptions')}
            aria-label={translation('filterOptions')}
            className={clsx('mx-2 mt-2 shrink-0', searchInputProps?.className)}
          />
        )}
        <ul
          ref={innerRef}
          id={ids.listbox}
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
              event.preventDefault()
              break
            case 'End':
              event.preventDefault()
              break
            case 'Enter':
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
          className={clsx('flex-col-0 p-2 overflow-auto')}
          role="listbox"
          aria-multiselectable={config.isMultiSelect}
          aria-orientation="vertical"
          aria-label={listboxAriaLabel}
          tabIndex={0}
        >
          {props.children}
        </ul>
      </div>
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
