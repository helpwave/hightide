import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { LabelProps } from './Label'
import { Label } from './Label'
import { SearchableList } from '../layout-and-navigation/SearchableList'
import type { TileProps } from '../layout-and-navigation/Tile'
import { Tile } from '../layout-and-navigation/Tile'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { ExpansionIcon } from '../layout-and-navigation/Expandable'
import { createPortal } from 'react-dom'

export type SelectTileProps = TileProps

export const SelectTile = ({
                             className,
                             disabledClassName,
                             title,
                             ...restProps
                           }: SelectTileProps) => {
  return (
    <Tile
      {...restProps}
      className={clsx('px-2 py-1 rounded-md', className)}
      disabledClassName={disabledClassName ?? 'text-disabled-text cursor-not-allowed'}
      title={{ ...title, className: title.className ?? 'font-semibold' }}
    />
  )
}

export type SelectOption<T> = {
  label: ReactNode,
  value: T,
  searchTags?: string[],
  disabled?: boolean,
  className?: string,
}

export type SelectProps<T> = {
  value?: T,
  label?: LabelProps,
  options: SelectOption<T>[],
  onChange: (value: T) => void,
  hintText?: string,
  isDisabled?: boolean,
  isSearchEnabled?: boolean,
  selectedDisplayOverwrite?: ReactNode,
  className?: string,
};

/**
 * A Select Component for selecting form a list of options
 *
 * The State is managed by the parent
 */
export const Select = <T, >({
                              value,
                              label,
                              options,
                              onChange,
                              hintText = '',
                              isDisabled,
                              isSearchEnabled = false,
                              className,
                              selectedDisplayOverwrite,
                            }: SelectProps<T>) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOutsideClick([triggerRef, menuRef], () => setIsOpen(false))
  const selectedOption = options.find(option => option.value === value)
  if (value !== undefined && selectedOption === undefined && selectedDisplayOverwrite === undefined) {
    console.warn('The selected value is not found in the options list. This might be an error on your part or' +
      ' default behavior if it is complex data type on which === does not work. In case of the latter' +
      ' use selectedDisplayOverwrite to set your selected text or component')
  }

  const isShowingHint = !selectedDisplayOverwrite && !selectedOption?.label

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setIsOpen(false)
    })
  }, [])

  const menu = isOpen ? (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: triggerRef.current?.getBoundingClientRect().bottom + window.scrollY,
        left: triggerRef.current?.getBoundingClientRect().left + window.scrollX,
        zIndex: 50
      }}
      className={clsx(
        'rounded-lg mt-0.5 bg-menu-background text-menu-text shadow-around-lg p-2',
        {
          'max-h-96 opacity-100 pb-2 overflow-y-auto transition-all duration-300 ease-in-out': isOpen,
          'max-h-0 opacity-0 overflow-hidden': !isOpen,
        }
      )}
    >
      <SearchableList
        list={options}
        minimumItemsForSearch={isSearchEnabled ? 0 : options.length}
        searchMapping={item => item.searchTags}
        itemMapper={(option, index) => (
          <SelectTile
            key={index}
            isSelected={selectedOption?.value === option.value}
            title={{ value: option.label }}
            onClick={() => {
              onChange(option.value)
              setIsOpen(false)
            }}
            isDisabled={option.disabled}
          />
        )}
      />
    </div>
  ) : null

  return (
    <>
      <div className={clsx(className)}>
        {label && (
          <Label {...label} labelType={label.labelType ?? 'labelBig'} className={clsx('mb-1', label.className)}/>
        )}
        <button
          ref={triggerRef}
          className={clsx(
            'btn-md justify-between w-full border-2',
            {
              'rounded-b-lg': !open,
              'bg-menu-background border-menu-border hover:border-primary': !isDisabled,
              'bg-disabled-background text-disabled-text border-disabled-background cursor-not-allowed': isDisabled
            }
          )}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isDisabled}
        >
          {!isShowingHint &&
            <span className="font-semibold text-menu-text">{selectedDisplayOverwrite ?? selectedOption?.label}</span>}
          {isShowingHint && (<span className="textstyle-description">{hintText}</span>)}
          <ExpansionIcon isExpanded={isOpen}/>
        </button>
      </div>
      {createPortal(menu, document.body)}
    </>
  )
}

export const SelectUncontrolled = <T, >({
                                          options, onChange, value, hintText, ...props
                                        }: SelectProps<T>) => {
  const [selected, setSelected] = useState(value)

  useEffect(() => {
    if (options.find(options => options.value === value)) {
      setSelected(value)
    }
  }, [options, value])

  return (
    <Select
      value={selected}
      options={options}
      onChange={value => {
        setSelected(value)
        onChange(value)
      }}
      hintText={hintText}
      {...props}
    />
  )
}