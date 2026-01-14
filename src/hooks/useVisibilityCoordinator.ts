import type { SetStateAction } from 'react'
import { useEffect, useId, useMemo, useState } from 'react'
import { useLogOnce } from './useLogOnce'
import { resolveSetState } from '../utils/resolveSetState'

export interface VisbilityCoordinatorItem {
  triggerIds: string[],
  targetId: string | null,
  activeTriggerId: string | null,
  isVisible: boolean,
}

export type VisbilityCoordinatorItemState = Record<string, unknown> | undefined

type VisbilityCoordinatorListener = (item: VisbilityCoordinatorItem) => void

export class VisbilityCoordinator {
  private static instance: VisbilityCoordinator | null = null

  static getInstance(): VisbilityCoordinator {
    if (!VisbilityCoordinator.instance) {
      VisbilityCoordinator.instance = new VisbilityCoordinator()
    }
    return VisbilityCoordinator.instance
  }

  private items: Record<string, VisbilityCoordinatorItem> = {}
  private states: Record<string, VisbilityCoordinatorItemState> = {}
  private listeners: Record<string, Set<VisbilityCoordinatorListener>> = {}

  get(id: string) {
    const item = this.items[id]
    if(!item) return
    return { ...item, triggerIds: [...item.triggerIds] }
  }

  setIsVisibile(id: string, isVisible: boolean, activeTriggerId: string | null = null) {
    const item = this.items[id]
    if(item && item.isVisible !== isVisible) {
      item.isVisible = isVisible
      item.activeTriggerId = activeTriggerId
      this.notify(id)
    } else {
      console.warn(`VisbilityCoordinator: No entry exists for "${id}" when trying to set its visiblity`)
    }
  }

  toggle(id: string, activeTriggerId: string | null = null) {
    const item = this.items[id]
    if(item) {
      item.isVisible = !item.isVisible
      item.activeTriggerId = activeTriggerId
      this.notify(id)
    } else {
      console.warn(`VisbilityCoordinator: No entry exists for "${id}" when trying to toggle its visiblity`)
    }
  }

  updateState(id: string, data: SetStateAction<Record<string, unknown> | undefined>) {
    this.states[id] = resolveSetState(data, this.states[id])
    this.notify(id)
  }

  updateId(id: string, updates: { oldId: string, newId: string, type: 'trigger' | 'target' }) {
    const item = this.items[id]
    if(!item) {
      console.warn(`VisbilityCoordinator: No entry exists for "${id}" when trying to update its ids`)
      return
    }

    const { oldId, newId, type } = updates

    if(type === 'target') {
      if(item.targetId !== oldId) {
        console.warn(`VisbilityCoordinator: TargetId "${oldId}" does not match current targetId "${item.targetId}" for item "${id}"`)
        return
      }
      item.targetId = newId
    } else if(type === 'trigger') {
      const index = item.triggerIds.indexOf(oldId)
      if(index === -1) {
        console.warn(`VisbilityCoordinator: TriggerId "${oldId}" not found for item "${id}"`)
        return
      }
      item.triggerIds[index] = newId
      if(item.activeTriggerId === oldId) {
        item.activeTriggerId = newId
      }
    }

    this.notify(id)
  }

  register(id: string, itemChange: Partial<VisbilityCoordinatorItem> = {}) {
    if(!this.items[id]) {
      this.items[id] = {
        isVisible: false,
        targetId: null,
        triggerIds: [],
        activeTriggerId: null,
      }
    }
    const item = this.items[id]
    item.isVisible = itemChange.isVisible ?? item.isVisible
    if(itemChange.activeTriggerId) {
      if(item.activeTriggerId) {
        console.error(`VisbilityCoordinator: Tried to set activeTriggerId "${itemChange.activeTriggerId}" on item with id "${id}" while the id is already set. Ensure your components only register once and unregister properly.`)
      } else {
        item.activeTriggerId = itemChange.activeTriggerId
      }
    }
    if(itemChange.targetId) {
      if(item.targetId) {
        console.error(`VisbilityCoordinator: Tried to set targetId "${itemChange.targetId}" on item with id "${id}" while the id is already set. Ensure your components only register once and unregister properly.`)
      } else {
        item.targetId = itemChange.targetId
      }
    }
    if(itemChange.triggerIds && itemChange.triggerIds.length > 0) {
      for(const triggerId of itemChange.triggerIds) {
        if(item.triggerIds.findIndex(id => id === triggerId) !== -1) {
          console.error(`VisbilityCoordinator: Tried to set triggerId "${triggerId}" on item with id "${id}" while the id is already set. Ensure your components only register once and unregister properly.`)
        } else {
          item.triggerIds.push(triggerId)
        }
      }
    }
    this.notify(id)
    return () => {
      if(itemChange.targetId) {
        item.targetId = null
      }
      if(itemChange.triggerIds) {
        for(const triggerId of itemChange.triggerIds) {
          const index = item.triggerIds.indexOf(triggerId)
          if (index !== -1) {
            item.triggerIds.splice(index, 1)
          }

          if(item.activeTriggerId === triggerId) {
            itemChange.activeTriggerId = null
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
    const item = this.get(id)
    if(!item) {
      console.warn(`VisbilityCoordinator: No entry exists for "${id}" when trying to notify about its changes`)
      return
    }
    const listeners = this.listeners[id]
    if(listeners) {
      listeners.forEach((callback) => callback(item))
    }
  }
}


export interface UseVisbilityCoordinatorProps {
  id: string,
  registerMode: 'trigger' | 'target' | 'both',
  target?: { id?: string },
  trigger?: { id?: string, isActiveTrigger?: boolean },
  isInitiallyVisible?: boolean,
}

export interface UseVisbilityCoordinatorObject {
  id: string,
  toggle: () => void,
  open: () => void,
  close: () => void,
  setVisible: (isVisible: boolean) => void,
}

export interface UseVisbilityCoordinatorResult extends VisbilityCoordinatorItem {
  trigger: UseVisbilityCoordinatorObject | null,
  target: UseVisbilityCoordinatorObject | null,
}

export function useVisbilityCoordinator({
  id: initialId,
  registerMode,
  target: targetOverwrite,
  trigger: triggerOverwrite,
  isInitiallyVisible,
} : UseVisbilityCoordinatorProps) : UseVisbilityCoordinatorResult {
  const generatedTargetId = useId()
  const generatedTriggerId = useId()

  const [mode] = useState(registerMode)
  const [id] = useState(initialId)
  useLogOnce('useVisbilityCoordinator: You cannot change the registration mode during the runtime', mode !== registerMode, { type: 'error' })
  useLogOnce('useVisbilityCoordinator: You cannot change the id during the runtime', id !== initialId, { type: 'error' })
  const targetId = useMemo(() => {
    if(mode === 'target' || mode === 'both') return targetOverwrite?.id ?? generatedTargetId
    return null
  }, [targetOverwrite?.id, generatedTargetId, mode])
  const triggerId = useMemo(() => {
    if(mode === 'trigger' || mode === 'both') return triggerOverwrite?.id ?? generatedTriggerId
    return null
  }, [triggerOverwrite?.id, generatedTriggerId, mode])
  const [previousIds, setPreviousIds] = useState<{ targetId: string | null, triggerId: string | null }>({ targetId, triggerId })

  const [item, setItem] = useState<VisbilityCoordinatorItem>({
    triggerIds: [],
    targetId: null,
    activeTriggerId: null,
    isVisible: false,
  })

  const coordinator = useMemo(() => VisbilityCoordinator.getInstance(), [])

  useEffect(() => {
    if(coordinator.get(id)) {
      return
    }
    const unsubscribe = coordinator.addListener(id, (newState) => {
      setItem(newState)
    })
    const unregister = coordinator.register(id, {
      targetId: targetId ?? undefined,
      triggerIds: triggerId ? [triggerId] : undefined,
      activeTriggerId: isInitiallyVisible && triggerOverwrite.isActiveTrigger ? triggerId : undefined,
      isVisible: isInitiallyVisible,
    })
    return () => {
      unsubscribe()
      unregister()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(previousIds.targetId !== targetId) {
      coordinator.updateId(targetId, { oldId: previousIds.targetId, newId: targetId, type: 'target' })
      setPreviousIds(prev => ({ ...prev, targetId }))
    }
  }, [coordinator, previousIds.targetId, targetId])

  useEffect(() => {
    if(previousIds.triggerId !== triggerId) {
      coordinator.updateId(triggerId, { oldId: previousIds.triggerId, newId: triggerId, type: 'target' })
      setPreviousIds(prev => ({ ...prev, triggerId }))
    }
  }, [coordinator, previousIds.triggerId, triggerId])

  const trigger = useMemo(() => {
    if(mode === 'trigger' || mode === 'both') {
      const activeTriggerId = triggerOverwrite?.isActiveTrigger ? triggerId : null
      return {
        id: triggerId,
        toggle: () => coordinator.toggle(id, activeTriggerId),
        open: () => coordinator.setIsVisibile(id, true, activeTriggerId),
        close: () => coordinator.setIsVisibile(id, false, activeTriggerId),
        setVisible: (isVisible: boolean) => coordinator.setIsVisibile(id, isVisible, activeTriggerId),
      }
    }
    return null
  }, [coordinator, id, mode, triggerId, triggerOverwrite?.isActiveTrigger])

  const target = useMemo(() => {
    if(mode === 'target' || mode === 'both') {
      return {
        id: targetId,
        toggle: () => coordinator.toggle(id, null),
        open: () => coordinator.setIsVisibile(id, true, null),
        close: () => coordinator.setIsVisibile(id, false, null),
        setVisible: (isVisible: boolean) => coordinator.setIsVisibile(id, isVisible, null),
      }
    }
    return null
  }, [coordinator, id, mode, targetId])

  return {
    ...item,
    trigger,
    target,
  }
}