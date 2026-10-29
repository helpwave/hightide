import type { ComponentRef, Ref } from 'react'
import { useCallback } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { SearchBarContext } from './SearchBarContext'
import { SearchBarField, type SearchBarFieldProps } from './SearchBarField'
import { SearchBarLayout, type SearchBarLayoutProps } from './SearchBarLayout'
import { SearchBarSearchButton, type SearchBarSearchButtonProps } from './SearchBarSearchButton'
import { SearchBarStateManager } from './SearchBarStateManager'
import type { SearchBarEvent, SearchBarState } from './SearchBarState'

export type SearchBarProps = ControllableInputProps<string, SearchBarEvent> & {
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
  onSearch,
  layoutRef,
  layoutProps,
  inputRef,
  inputProps,
  searchButtonRef,
  searchButtonProps,
}: SearchBarProps) => {
  const [state, setState] = useControlledState<SearchBarState>({
    defaultValue: { value: initialValue ?? '' },
  })
  const binding = useStateMachineBinding<SearchBarState, string>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: string) => ({ value: next }), []),
    get: useCallback((current: SearchBarState) => current.value, []),
  })

  return (
    <SearchBarStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      onSearch={onSearch}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
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
