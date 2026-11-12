import type { Ref } from 'react'
import clsx from 'clsx'
import type { ComboboxSearchbarProps } from './ComboboxSearchbar'
import { ComboboxSearchbar } from './ComboboxSearchbar'
import type { ComboboxListProps } from './ComboboxList'
import { ComboboxList } from './ComboboxList'
import type { ComboboxPopUpProps } from './ComboboxPopUp'
import { ComboboxPopUp } from './ComboboxPopUp'
import type { ComboboxStateManagerProps } from './ComboboxStateManager'
import { ComboboxStateManager } from './ComboboxStateManager'

export type ComboboxProps<T = string> = Omit<ComboboxStateManagerProps<T>, 'children'> & {
  searchbarRef?: Ref<HTMLInputElement>,
  popupRef?: Ref<HTMLDivElement>,
  listRef?: Ref<HTMLUListElement>,
  searchbarProps?: ComboboxSearchbarProps,
  popupProps?: ComboboxPopUpProps,
  listProps?: Omit<ComboboxListProps<T>, 'children'>,
}

export function ComboboxComponent<T = string>({
  searchbarRef,
  popupRef,
  listRef,
  searchbarProps,
  popupProps,
  listProps,
  ...props
}: ComboboxProps<T>) {
  const list = (
    <ComboboxList
      {...listProps}
      ref={listRef}
      className={clsx(props.isInline && 'max-h-64', listProps?.className)}
    />
  )

  return (
    <ComboboxStateManager<T> {...props}>
      <div className={clsx('combobox-root', props.isInline && 'w-full')}>
        <ComboboxSearchbar
          {...searchbarProps}
          ref={searchbarRef}
        />
        {props.isInline ? list : (
          <ComboboxPopUp
            {...popupProps}
            ref={popupRef}
          >
            {list}
          </ComboboxPopUp>
        )}
      </div>
    </ComboboxStateManager>
  )
}
