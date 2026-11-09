import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { SearchBarContext } from './SearchBarContext'
import { SearchBarField, type SearchBarFieldProps } from './SearchBarField'
import { SearchBarLayout, type SearchBarLayoutProps } from './SearchBarLayout'
import { SearchBarSearchButton, type SearchBarSearchButtonProps } from './SearchBarSearchButton'
import { SearchBarStateManager } from './SearchBarStateManager'
import { type SearchBarEvent, type SearchBarState } from './SearchBarState'

export type SearchBarProps = ControllableDOMInputProps<string, SearchBarEvent> & {
  onSearch: (value: string) => void,
  layoutRef?: Ref<ComponentRef<typeof SearchBarLayout>>,
  layoutProps?: SearchBarLayoutProps,
  inputRef?: SearchBarFieldProps['inputRef'],
  inputProps?: SearchBarFieldProps['inputProps'],
  searchButtonRef?: Ref<ComponentRef<typeof SearchBarSearchButton>>,
  searchButtonProps?: SearchBarSearchButtonProps,
}

const SearchBarComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  onSearch,
  layoutRef,
  layoutProps,
  inputRef,
  inputProps,
  searchButtonRef,
  searchButtonProps,
}: SearchBarProps) => {
  const store = useStateStore<SearchBarState>({
    value: value ?? initialValue ?? '',
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      value: { value, onValueChange },
    },
  })

  return (
    <SearchBarStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      onSearch={onSearch}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
    >
      <SearchBarLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <SearchBarField inputRef={inputRef} inputProps={inputProps} />
        <SearchBarSearchButton
          {...searchButtonProps}
          ref={ReactUtils.assingRefsBuilder([searchButtonRef])}
        />
      </SearchBarLayout>
    </SearchBarStateManager>
  )
}

export const SearchBar = Object.assign(SearchBarComponent, {
  StateManager: SearchBarStateManager,
  Layout: SearchBarLayout,
  Field: SearchBarField,
  SearchButton: SearchBarSearchButton,
  Context: SearchBarContext,
  Provider: SearchBarContext.Provider,
  Consumer: SearchBarContext.Consumer,
})
