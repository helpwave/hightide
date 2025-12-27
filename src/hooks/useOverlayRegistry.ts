import { useEffect, useId, useMemo, useState } from 'react'

export type OverlayItem = {
  id: string,
   tags?: string[],
}

type OverlayItemInformation = OverlayItem & {
  zIndex: number,
  position: number,
  tagPositions: Record<string, number>,
}

type OverlayRegistryValue = {
    itemInformation: Record<string, OverlayItemInformation>,
    tagItemCounts: Record<string, number>,
    activeId: string | null,
}

type OverlayRegistryListenerCallback = (value: OverlayRegistryValue) => void

class OverlayRegistry {
  private static instance: OverlayRegistry | null = null

  static getInstance(): OverlayRegistry {
    if (!OverlayRegistry.instance) {
      OverlayRegistry.instance = new OverlayRegistry()
    }
    return OverlayRegistry.instance
  }

  private overlayIds = new Set<string>()
  private overlayItems: Record<string, OverlayItem> = {}
  private listeners = new Set<OverlayRegistryListenerCallback>()

  register(item: OverlayItem) {
    this.overlayIds.add(item.id)
    this.overlayItems[item.id] = item
    this.notify()
  }

  update(item: OverlayItem) {
    this.overlayItems[item.id] = item
    this.notify()
  }

  unregister(item: OverlayItem) {
    this.overlayIds.delete(item.id)
    delete this.overlayItems[item.id]
    this.notify()
  }

  addListener(callback: OverlayRegistryListenerCallback) {
    this.listeners.add(callback)
  }

  removeListener(callback: OverlayRegistryListenerCallback) {
    this.listeners.delete(callback)
  }

  private notify() {
    const itemInformation: Record<string, OverlayItemInformation> = {}
    const ids = [...this.overlayIds]
    const startZIndex = 100
    const tagCount: Record<string, number> = {}
    for (let index = ids.length - 1; index >= 0; index--) {
      const id = ids[index]
      const item = this.overlayItems[id]
      itemInformation[id] = {
        ...item,
        position: index,
        tagPositions: {},
        zIndex: startZIndex + index,
      }
      for(const tag of item.tags ?? []) {
        let position = tagCount[tag]
        if(position === undefined) {
          position = 0
        } else {
          position++
        }
        tagCount[tag] = position
        itemInformation[id].tagPositions[tag] = position
      }
    }
    for (const callback of this.listeners) {
      callback({ activeId: ids[0] ?? null, itemInformation, tagItemCounts: tagCount })
    }
  }
}

type UseOverlayRegistryProps = Partial<OverlayItem> & {
    isActive?: boolean,
    /** Tags cannot change on every render, thus make sure they are wrapped in a useMemo or similar */
    tags?: string[],
}

type UseOverlayRegistryResult = {
    isInFront: boolean,
    zIndex?: number,
    position?: number,
    tagPositions?: Record<string, number>,
    hasAppeared: boolean,
    tagItemCounts: Record<string, number>,
}

export const useOverlayRegistry = (props?: UseOverlayRegistryProps): UseOverlayRegistryResult => {
  const generatedId = useId()
  const [hasAppeared, setHasAppeared] = useState<boolean>(props.isActive)
  const item: OverlayItem = useMemo(() => ({
    id: props?.id ?? generatedId,
    tags: props?.tags,
  }), [props?.id, generatedId, props?.tags])
  const [value, setValue] = useState<OverlayRegistryValue>({
    activeId: null,
    itemInformation: {},
    tagItemCounts: {}
  })
  const registry = useMemo(() => OverlayRegistry.getInstance(), [])

  useEffect(() => {
    if(!props.isActive) {
      return
    }
    function callback(value: OverlayRegistryValue) {
      setValue(value)
    }

    registry.addListener(callback)
    registry.register(item)
    setHasAppeared(true)
    return () => {
      registry.removeListener(callback)
      registry.unregister(item)
      setValue({
        activeId: null,
        itemInformation: {},
        tagItemCounts: {}
      })
      setHasAppeared(false)
    }
  }, [props?.isActive, item, registry])

  const itemInformation = value.itemInformation[item.id]

  return {
    isInFront: value.activeId === item.id,
    zIndex: itemInformation?.zIndex,
    position: itemInformation?.position,
    tagPositions: itemInformation?.tagPositions,
    hasAppeared,
    tagItemCounts: value.tagItemCounts,
  }
}