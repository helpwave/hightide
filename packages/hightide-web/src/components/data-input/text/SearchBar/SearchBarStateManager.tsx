import { useCallback, useMemo } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import { useInputStateManager, useStableEvent } from '@helpwave/hightide-utils/hooks'
import { SearchBarContext, type SearchBarContextValue } from './SearchBarContext'
import { searchBarStateTransition, type SearchBarEvent, type SearchBarState } from './SearchBarState'

export type SearchBarStateManagerProps = DOMInputStateManagerProps<SearchBarState, SearchBarEvent> & {
  onSearch: (value: string) => void,
}

export function SearchBarStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  onSearch,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: SearchBarStateManagerProps) {
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: { value: '' },
    transition: searchBarStateTransition,
    onStateChange,
    onStateEvent,
  })
  const onSearchStable = useStableEvent(onSearch)
  const dispatch = useCallback((event: SearchBarEvent) => {
    machine.dispatch(event)
    if (event.type === 'commit') {
      onSearchStable(event.value)
    }
  }, [machine, onSearchStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])
  const contextValue = useMemo<SearchBarContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
    onSearch: onSearchStable,
  }), [config, dispatch, machine.state, onSearchStable])

  return (
    <SearchBarContext.Provider value={contextValue}>
      {children}
    </SearchBarContext.Provider>
  )
}
