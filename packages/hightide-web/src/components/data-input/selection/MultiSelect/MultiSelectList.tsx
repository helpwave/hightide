import clsx from 'clsx'
import { CheckIcon } from 'lucide-react'
import type { ForwardedRef, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { forwardRef, useRef } from 'react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { Icon } from '../../../visualization/Icon'
import { ColoringUtils } from '../../../../utils/coloring'
import { Visibility } from '../../../layout/Visibility'
import type { SelectionListElementProps } from '../option'
import { useSelectionListKeyDown } from '../useSelectionListKeyDown'
import { useMultiSelectContext } from './MultiSelectContext'

export type MultiSelectListElementProps<T> = SelectionListElementProps<T>

export type MultiSelectListProps<T = string> = HTMLAttributes<HTMLUListElement> & {
  listElement?: (props: MultiSelectListElementProps<T>) => ReactNode,
  statusProps?: HTMLAttributes<HTMLLIElement>,
}

function DefaultMultiSelectListElement<T>({
  option,
  optionRef,
  isSelected,
  isHighlighted,
  isVisible,
}: MultiSelectListElementProps<T>) {
  const context = useMultiSelectContext<T>()
  const disabled = Boolean(option.disabled)
  const iconAppearance = context.config.iconAppearance
  const domId = context.config.ids.listbox + '-' + option.id

  return (
    <li
      ref={optionRef}
      id={domId}
      tabIndex={-1}
      hidden={!isVisible}
      role="option"
      aria-disabled={disabled}
      aria-selected={isSelected}
      aria-hidden={!isVisible}
      className={clsx('multi-select-list-option', option.visual?.className)}
      style={option.visual?.style}
      {...ColoringUtils.build({
        color: 'surface-inverse',
        mode: 'interactive',
        coloringStyle: 'foreground',
      })}
      data-highlighted={isHighlighted ? '' : undefined}
      data-selected={isSelected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-visible={isVisible ? '' : undefined}
      onClick={() => {
        if (!disabled) context.toggleSelection(option.id)
      }}
    >
      {iconAppearance === 'left' && (
        <Icon
          icon={CheckIcon}
          size="xs"
          className={clsx({ 'opacity-0': !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
      {option.visual?.content ?? option.label}
      {iconAppearance === 'right' && (
        <Icon
          icon={CheckIcon}
          size="xs"
          className={clsx({ 'opacity-0': !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
    </li>
  )
}

type MultiSelectListComponent = <T = string>(
  props: MultiSelectListProps<T> & {
    ref?: ForwardedRef<HTMLUListElement>,
  }
) => ReactElement

const MultiSelectListImpl = forwardRef<HTMLUListElement, MultiSelectListProps<unknown>>(function MultiSelectList<T>({
  listElement,
  statusProps,
  ...props
}: MultiSelectListProps<T>, ref: ForwardedRef<HTMLUListElement>) {
  const translation = useHightideTranslation()
  const innerRef = useRef<HTMLUListElement>(null)
  const context = useMultiSelectContext<T>()
  const showSearch = context.search.hasSearch
  const listboxAriaLabel = showSearch ? translation('searchResults') : undefined
  const keyHandler = useSelectionListKeyDown({
    isSearchVisible: showSearch,
    highlightedId: context.highlightedId,
    highlightNext: context.highlightNext,
    highlightPrevious: context.highlightPrevious,
    highlightFirst: context.highlightFirst,
    highlightLast: context.highlightLast,
    onConfirm: context.toggleSelection,
    onTypeahead: context.handleTypeaheadKey,
    confirmOnSpace: true,
  })
  const Row = listElement ?? DefaultMultiSelectListElement
  const visibleIds = new Set(context.visibleOptionIds)

  return (
    <ul
      {...props}
      ref={ReactUtils.assingRefsBuilder([innerRef, ref])}
      id={context.config.ids.listbox}
      onKeyDown={showSearch ? props.onKeyDown : (event) => {
        props.onKeyDown?.(event)
        keyHandler(event)
      }}
      role="listbox"
      aria-multiselectable={true}
      aria-orientation="vertical"
      aria-label={listboxAriaLabel}
      tabIndex={showSearch ? undefined : 0}
      className={clsx('multi-select-list flex-col-1 p-2 overflow-auto', props.className)}
    >
      {context.options.map((option) => {
        const isVisible = visibleIds.has(option.id)
        if (!isVisible) return null
        const optionRef = context.optionRefs[option.id]
        if (!optionRef) return null
        return (
          <Row
            key={option.id}
            option={option}
            optionRef={optionRef}
            isSelected={context.selectedIds.includes(option.id)}
            isHighlighted={context.highlightedId === option.id}
            isVisible={isVisible}
          />
        )
      })}
      <Visibility isVisible={showSearch}>
        <li
          {...statusProps}
          role="option"
          aria-selected={false}
          aria-disabled={true}
          aria-live="polite"
          aria-atomic={true}
          className={clsx('multi-select-list-status', { 'sr-only': context.visibleOptionIds.length > 0 }, statusProps?.className)}
        >
          {translation('nResultsFound', { count: context.visibleOptionIds.length })}
        </li>
      </Visibility>
    </ul>
  )
})

export const MultiSelectList = MultiSelectListImpl as MultiSelectListComponent
