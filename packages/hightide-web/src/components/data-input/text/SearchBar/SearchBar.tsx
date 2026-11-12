import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { SearchBarContext } from './SearchBarContext'
import { SearchBarField, type SearchBarFieldProps } from './SearchBarField'
import { SearchBarLayout, type SearchBarLayoutProps } from './SearchBarLayout'
import { SearchBarSearchButton, type SearchBarSearchButtonProps } from './SearchBarSearchButton'
import { SearchBarStateManager, type SearchBarStateManagerProps } from './SearchBarStateManager'

export type SearchBarProps = Omit<SearchBarStateManagerProps, 'children'> & {
  onSearch: (value: string) => void,
  layoutRef?: Ref<ComponentRef<typeof SearchBarLayout>>,
  layoutProps?: SearchBarLayoutProps,
  inputRef?: SearchBarFieldProps['inputRef'],
  inputProps?: SearchBarFieldProps['inputProps'],
  searchButtonRef?: Ref<ComponentRef<typeof SearchBarSearchButton>>,
  searchButtonProps?: SearchBarSearchButtonProps,
}

const SearchBarComponent = ({
  layoutRef,
  layoutProps,
  inputRef,
  inputProps,
  searchButtonRef,
  searchButtonProps,
  ...props
}: SearchBarProps) => {
  return (
    <SearchBarStateManager
      {...props}
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
