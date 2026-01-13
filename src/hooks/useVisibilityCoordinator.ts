import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useLogOnce } from './useLogOnce'

export interface VisbilityCoordinatorItemState {
  triggerIds: string[],
  targetId: string | null,
  activeTriggerId: string | null,
  isVisible: boolean,
}

type VisbilityCoordinatorListener = (state: VisbilityCoordinatorItemState) => void

export class VisbilityCoordinator {
  private static instance: VisbilityCoordinator | null = null

  static getInstance(): VisbilityCoordinator {
    if (!VisbilityCoordinator.instance) {
      VisbilityCoordinator.instance = new VisbilityCoordinator()
    }
    return VisbilityCoordinator.instance
  }

  private states: Record<string, VisbilityCoordinatorItemState> = {}
  private listeners: Record<string, Set<VisbilityCoordinatorListener>> = {}

  get(id: string) {
    const state = this.states[id]
    if(!state) return
    return { ...state, triggerIds: [...state.triggerIds] }
  }

  setIsVisibile(id: string, isVisible: boolean) {
    const state = this.get(id)
    if(state) {
      state.isVisible = isVisible
      this.notify(id)
    } else {
      console.warn(`VisbilityCoordinator: No entry exists for "${id}" when trying to set its visiblity`)
    }
  }

  toggle(id: string) {
    const state = this.get(id)
    if(state) {
      state.isVisible = !state.isVisible
      this.notify(id)
    } else {
      console.warn(`VisbilityCoordinator: No entry exists for "${id}" when trying to toggle its visiblity`)
    }
  }

  updateId(id: string, updates: { oldId: string, newId: string, type: 'trigger' | 'target' }) {
    const state = this.states[id]
    if(!state) {
      console.warn(`VisbilityCoordinator: No entry exists for "${id}" when trying to update its ids`)
      return
    }

    const { oldId, newId, type } = updates

    if(type === 'target') {
      if(state.targetId !== oldId) {
        console.warn(`VisbilityCoordinator: TargetId "${oldId}" does not match current targetId "${state.targetId}" for item "${id}"`)
        return
      }
      state.targetId = newId
    } else if(type === 'trigger') {
      const index = state.triggerIds.indexOf(oldId)
      if(index === -1) {
        console.warn(`VisbilityCoordinator: TriggerId "${oldId}" not found for item "${id}"`)
        return
      }
      state.triggerIds[index] = newId
      if(state.activeTriggerId === oldId) {
        state.activeTriggerId = newId
      }
    }

    this.notify(id)
  }

  register(id: string, stateChange: Partial<VisbilityCoordinatorItemState> = {}) {
    if(!this.states[id]) {
      this.states[id] = {
        isVisible: false,
        targetId: null,
        triggerIds: [],
        activeTriggerId: null
      }
    }
    const state = this.states[id]
    state.isVisible = stateChange.isVisible ?? state.isVisible
    if(stateChange.activeTriggerId) {
      if(state.activeTriggerId) {
        console.error(`VisbilityCoordinator: Tried to set activeTriggerId "${stateChange.activeTriggerId}" on item with id "${id}" while the id is already set. Ensure your components only register once and unregister properly.`)
      } else {
        state.activeTriggerId = stateChange.activeTriggerId
      }
    }
    if(stateChange.targetId) {
      if(state.targetId) {
        console.error(`VisbilityCoordinator: Tried to set targetId "${stateChange.targetId}" on item with id "${id}" while the id is already set. Ensure your components only register once and unregister properly.`)
      } else {
        state.targetId = stateChange.targetId
      }
    }
    if(stateChange.triggerIds && stateChange.triggerIds.length > 0) {
      for(const triggerId of stateChange.triggerIds) {
        if(state.triggerIds.findIndex(id => id === triggerId) !== -1) {
          console.error(`VisbilityCoordinator: Tried to set triggerId "${triggerId}" on item with id "${id}" while the id is already set. Ensure your components only register once and unregister properly.`)
        } else {
          state.triggerIds.push(triggerId)
        }
      }
    }
    this.notify(id)
    return () => {
      if(stateChange.targetId) {
        state.targetId = null
      }
      if(stateChange.triggerIds) {
        for(const triggerId of stateChange.triggerIds) {
          const index = state.triggerIds.indexOf(triggerId)
          if (index !== -1) {
            state.triggerIds.splice(index, 1)
          }

          if(state.activeTriggerId === triggerId) {
            stateChange.activeTriggerId = null
          }
        }
      }
      this.notify(id)
    }
  }

  addListener(id: string, callback: VisbilityCoordinatorListener) {
    if(!this.listeners[id]) {
      this.listeners[id] = new Set()
    }
    this.listeners[id].add(callback)
    return () => {
      this.listeners[id].delete(callback)
      if(this.listeners[id].size === 0) {
        delete this.listeners[id]
      }
    }
  }

  private notify(id: string) {
    const state = this.get(id)
    if(!state) {
      console.warn(`VisbilityCoordinator: No entry exists for "${id}" when trying to notify about its changes`)
      return
    }
    const listeners = this.listeners[id]
    if(listeners) {
      listeners.forEach((callback) => callback(state))
    }
  }
}


export interface UseVisbilityCoordinatorProps {
  id: string,
  registerMode: 'trigger' | 'target' | 'both' | 'observer',
  targetId?: string,
  triggerId?: string,
}

export interface UseVisbilityCoordinatorResult extends VisbilityCoordinatorItemState {
  toggle: () => void,
  open: () => void,
  close: () => void,
  setVisible: (isVisible: boolean) => void,
  trigger: { id: string } | null,
  target: { id: string } | null,
}

export function useVisbilityCoordinator({
  id: initialId,
  registerMode,
  targetId: targetIdOverwrite,
  triggerId: triggerIdOverwrite
} : UseVisbilityCoordinatorProps) : UseVisbilityCoordinatorResult {
  const generatedTargetId = useId()
  const generatedTriggerId = useId()

  const [mode] = useState(registerMode)
  const [id] = useState(initialId)
  useLogOnce('useVisbilityCoordinator: You cannot change the registration mode during the runtime', mode !== registerMode, {type: "error"})
  useLogOnce('useVisbilityCoordinator: You cannot change the id during the runtime', id !== initialId, {type: "error"})
  const targetId = useMemo(() => targetIdOverwrite ?? generatedTargetId, [targetIdOverwrite, generatedTargetId])
  const triggerId = useMemo(() => triggerIdOverwrite ?? generatedTriggerId, [triggerIdOverwrite, generatedTriggerId])

  const [state, setState] = useState<VisbilityCoordinatorItemState>({
    triggerIds: [],
    targetId: null,
    activeTriggerId: null,
    isVisible: false,
  })

  const coordinator = useMemo(() => VisbilityCoordinator.getInstance(), [])

  useEffect(() => {
    const 
    if(mode === 'observer') {
      function callback(newState: VisbilityCoordinatorItemState) {
        setState(newState)
      }
      const removeListener = coordinator.addListener(id, callback)
      const currentState = coordinator.get(id)
      if(currentState) {
        setState(currentState)
      }
      return () => {
        removeListener()
      }
    }

  }, [])

  useEffect(() => {
    coordinator.updateId(id, )
  }, [targetId])

  const toggle = useMemo(() => () => {
    coordinator.toggle(id)
  }, [id, coordinator])

  const open = useMemo(() => () => {
    coordinator.setIsVisibile(id, true)
  }, [id, coordinator])

  const close = useMemo(() => () => {
    coordinator.setIsVisibile(id, false)
  }, [id, coordinator])

  const setVisible = useMemo(() => (isVisible: boolean) => {
    coordinator.setIsVisibile(id, isVisible)
  }, [id, coordinator])

  const trigger = useMemo(() => {
    if(registerMode === 'trigger' || registerMode === 'both') {
      return { id: triggerId }
    }
    return null
  }, [registerMode, triggerId])

  const target = useMemo(() => {
    if(registerMode === 'target' || registerMode === 'both') {
      return { id: targetId }
    }
    return null
  }, [registerMode, targetId])

  return {
    ...state,
    toggle,
    open,
    close,
    setVisible,
    trigger,
    target,
  }
}