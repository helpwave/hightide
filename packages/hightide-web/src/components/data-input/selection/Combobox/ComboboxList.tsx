import type { HTMLAttributes, RefObject } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Plus } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Icon } from '../../../visualization/Icon'
import { useComboboxContext } from './ComboboxContext'

export type ComboboxListProps = HTMLAttributes<HTMLUListElement> & {
  statusProps?: HTMLAttributes<HTMLLIElement>,
}

export const ComboboxList = forwardRef<HTMLUListElement, ComboboxListProps>(
  function ComboboxList({ children, statusProps, ...props }, ref) {
    const translation = useHightideTranslation()
    const context = useComboboxContext()
    const { layout } = context
    const { registerList } = layout
    const innerRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
      return registerList(innerRef as RefObject<HTMLUListElement | null>)
    }, [registerList])

    const setRefs = (node: HTMLUListElement | null) => {
      (innerRef as RefObject<HTMLUListElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as RefObject<HTMLUListElement | null>).current = node
    }

    const { newValueId, isAllowingNewValue } = context.config
    const newValue = context.search.searchQuery.trim()
    const showNewValue = isAllowingNewValue && context.visibleOptionIds.includes(newValueId) && newValue.length > 0
    const isNewValueHighlighted = context.highlightedId === newValueId
    const count = context.visibleOptionIds.filter((id) => id !== newValueId).length

    return (
      <ul
        {...props}
        ref={setRefs}
        id={context.config.ids.listbox}
        role="listbox"
        aria-label={translation('filterOptions')}
        tabIndex={-1}
        className={clsx('combobox-list', props.className)}>
        {children}
        {showNewValue && (
          <li
            id={newValueId}
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
  }
)
