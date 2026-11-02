import type { ForwardedRef, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { Plus } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { Icon } from '../../../visualization/Icon'
import { useSelectionListKeyDown } from '../useSelectionListKeyDown'
import { useComboboxContext } from './ComboboxContext'
import { ComboboxListItemElement, type ComboboxListElementProps } from './ComboboxListItemElement'

export type { ComboboxListElementProps } from './ComboboxListItemElement'

export type ComboboxListProps<T = string> = HTMLAttributes<HTMLUListElement> & {
  listElement?: (props: ComboboxListElementProps<T>) => ReactNode,
  statusProps?: HTMLAttributes<HTMLLIElement>,
}

type ComboboxListComponent = <T = string>(
  props: ComboboxListProps<T> & {
    ref?: ForwardedRef<HTMLUListElement>,
  }
) => ReactElement

const ComboboxListImpl = forwardRef<HTMLUListElement, ComboboxListProps<unknown>>(function ComboboxList<T>({
  listElement,
  statusProps,
  ...props
}: ComboboxListProps<T>, ref: ForwardedRef<HTMLUListElement>) {
  const translation = useHightideTranslation()
  const context = useComboboxContext<T>()

  const { newValueId, isAllowingNewValue } = context.config
  const newValue = context.search.searchQuery.trim()
  const showNewValue = isAllowingNewValue && context.visibleOptionIds.includes(newValueId) && newValue.length > 0
  const isNewValueHighlighted = context.highlightedId === newValueId
  const count = context.visibleOptionIds.filter((id) => id !== newValueId).length
  const keyHandler = useSelectionListKeyDown({
    isSearchVisible: false,
    highlightedId: context.highlightedId,
    highlightNext: context.highlightNext,
    highlightPrevious: context.highlightPrevious,
    highlightFirst: context.highlightFirst,
    highlightLast: context.highlightLast,
    onConfirm: context.selectOption,
    confirmOnSpace: true,
  })
  const Row = listElement ?? ComboboxListItemElement
  const visibleIds = new Set(context.visibleOptionIds)
  const newValueRef = context.optionRefs[newValueId]

  return (
    <ul
      {...props}
      ref={ReactUtils.assingRefsBuilder([context.layout.listRef, ref])}
      id={context.config.ids.listbox}
      role="listbox"
      aria-label={translation('filterOptions')}
      tabIndex={-1}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        keyHandler(event)
      }}
      className={clsx('combobox-list', props.className)}
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
            isSelected={context.value !== undefined && option.value === context.value}
            isHighlighted={context.highlightedId === option.id}
            isVisible={isVisible}
          />
        )
      })}
      {showNewValue && newValueRef && (
        <li
          ref={newValueRef}
          id={context.config.ids.listbox + '-' + newValueId}
          tabIndex={-1}
          role="option"
          aria-selected={isNewValueHighlighted}
          data-highlighted={isNewValueHighlighted ? '' : undefined}
          className="combobox-option combobox-new-value"
          onMouseEnter={() => context.highlightItem(newValueId)}
          onClick={() => context.addNewValue()}
        >
          <Icon icon={Plus} size="sm" aria-hidden={true} />
          <span>{`Add "${newValue}"`}</span>
        </li>
      )}
      <li
        {...statusProps}
        role="option"
        aria-selected={false}
        aria-disabled={true}
        aria-live="polite"
        aria-atomic={true}
        className={clsx('combobox-list-status', { 'sr-only': count > 0 }, statusProps?.className)}
      >
        {translation('nResultsFound', { count })}
      </li>
    </ul>
  )
})

export const ComboboxList = ComboboxListImpl as ComboboxListComponent
