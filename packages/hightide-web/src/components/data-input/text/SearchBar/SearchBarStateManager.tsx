import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { SearchBarContext, type SearchBarContextValue } from './SearchBarContext'
import { searchBarStateTransition, type SearchBarEvent, type SearchBarState } from './SearchBarState'

export type SearchBarStateManagerProps = InputStateMangerProps<SearchBarState, SearchBarEvent> & {
  onSearch: (value: string) => void,
  children?: ReactNode,
}

export function SearchBarStateManager({
  state,
  onStateChange,
  onStateEvent,
  onSearch,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  children,
}: SearchBarStateManagerProps) {
  const machine = useStateMachine<SearchBarState, SearchBarEvent>({
    state,
    transition: searchBarStateTransition,
    onStateChange,
  })
  const onStateEventStable = useStableEvent(onStateEvent)
  const onSearchStable = useStableEvent(onSearch)
  const dispatch = useCallback((event: SearchBarEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
    if (event.type === 'commit') {
      onSearchStable(event.value)
    }
  }, [machine, onSearchStable, onStateEventStable])
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])
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
