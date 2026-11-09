import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStableEvent, useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { SearchBarContext, type SearchBarContextValue } from './SearchBarContext'
import { searchBarStateTransition, type SearchBarEvent, type SearchBarState } from './SearchBarState'

export type SearchBarStateManagerProps = DOMInputStateMangerProps<SearchBarState, SearchBarEvent> & {
  onSearch: (value: string) => void,
  children?: ReactNode,
}

export function SearchBarStateManager({
  state,
  initialState,
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
  const machine = useStateMachineController<SearchBarState, SearchBarEvent>(state
    ? {
      state,
      transition: searchBarStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
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
