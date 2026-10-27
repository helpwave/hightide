import type { ReactNode, RefObject } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { StateManagerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { MenuContext, type MenuContextValue } from './MenuContext'
import { menuStateTransition, type MenuEvent, type MenuState } from './MenuState'

export type MenuStateManagerProps = StateManagerProps<MenuState, MenuEvent> & {
  disabled?: boolean,
  children?: ReactNode,
}

export function MenuStateManager({
  state,
  onStateChange,
  onStateEvent,
  disabled = false,
  children,
}: MenuStateManagerProps) {
  const machine = useStateMachine<MenuState, MenuEvent>({
    state,
    transition: (current, event) => menuStateTransition(current, event, disabled),
    onStateChange,
  })

  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: MenuEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])

  const fallbackTriggerRef = useRef<HTMLElement | null>(null)
  const [triggerRef, setTriggerRefState] = useState<RefObject<HTMLElement | null>>(fallbackTriggerRef)
  const setTriggerRef = useCallback((ref: RefObject<HTMLElement | null> | null) => {
    setTriggerRefState(ref ?? fallbackTriggerRef)
  }, [])

  const contextValue = useMemo<MenuContextValue>(() => ({
    state: machine.state,
    dispatch,
    disabled,
    triggerRef,
    setTriggerRef,
  }), [disabled, dispatch, machine.state, setTriggerRef, triggerRef])

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  )
}
