import type { RefObject } from 'react'
import { useId, useMemo, useRef } from 'react'
import type { StateManagerProps } from '@helpwave/hightide-utils/interfaces'
import { useStateManager } from '@helpwave/hightide-utils/hooks'
import { PopUpContext } from './PopUpContext'
import { popUpStateTransition, type PopUpEvent, type PopUpState } from './PopUpState'

export type PopUpStateManagerProps = StateManagerProps<PopUpState, PopUpEvent> & {
  popUpId?: string,
  triggerId?: string,
}

export function PopUpStateManager({
  state,
  onStateChange,
  onStateEvent,
  popUpId: popUpIdOverwrite,
  triggerId: triggerIdOverwrite,
  children,
}: PopUpStateManagerProps) {
  const machine = useStateManager({
    state,
    initialState: { isOpen: false },
    transition: popUpStateTransition,
    onStateChange,
    onStateEvent,
  })
  const generatedPopUpId = useId()
  const generatedTriggerId = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  const popUpId = popUpIdOverwrite ?? `pop-up-${generatedPopUpId}`
  const triggerId = triggerIdOverwrite ?? `pop-up-trigger-${generatedTriggerId}`

  const contextValue = useMemo(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    popUpId,
    triggerId,
    triggerRef: triggerRef as RefObject<HTMLElement | null>,
  }), [machine.dispatch, machine.state, popUpId, triggerId])

  return (
    <PopUpContext.Provider value={contextValue}>
      {children}
    </PopUpContext.Provider>
  )
}
