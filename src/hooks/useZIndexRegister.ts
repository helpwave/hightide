import { useEffect, useMemo, useState } from 'react'

type ZIndexListenerCallback = (zIndex: number) => void

class ZIndexRegistry {
  private static instance: ZIndexRegistry | null = null

  static getInstance(): ZIndexRegistry {
    if (!ZIndexRegistry.instance) {
      ZIndexRegistry.instance = new ZIndexRegistry()
    }
    return ZIndexRegistry.instance
  }

  private listeners = new Set<ZIndexListenerCallback>()

  register(callback: ZIndexListenerCallback) {
    this.listeners.add(callback)
    this.notify()
  }

  deregister(callback: ZIndexListenerCallback) {
    this.listeners.delete(callback)
    this.notify()
  }

  private notify() {
    let i = 100
    for (const callback of this.listeners) {
      callback(i++)
    }
  }
}

// TODO consider option to set a minimum zIndex
export function useZIndexRegister(isActive: boolean) {
  const [zIndex, setZIndex] = useState(0)
  const zIndexRegistry = useMemo(() => ZIndexRegistry.getInstance(), [])

  useEffect(() => {
    if(!isActive) {
      return
    }
    function callback(zIndex: number) {
      setZIndex(zIndex)
    }

    zIndexRegistry.register(callback)
    return () => {
      zIndexRegistry.deregister(callback)
      setZIndex(0)
    }
  }, [isActive, zIndexRegistry])

  return zIndex
}