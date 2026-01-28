'use client'

export type StorageSubscriber = (raw: string | null) => void

export class StorageListener {
  private static instance: StorageListener | null = null

  private localSubscriptions = new Map<string, Set<StorageSubscriber>>()
  private sessionSubscriptions = new Map<string, Set<StorageSubscriber>>()
  private initialized = false

  private constructor() {}

  static getInstance(): StorageListener {
    if (!this.instance) {
      this.instance = new StorageListener()
    }
    return this.instance
  }

  subscribe(storage: Storage, key: string, cb: StorageSubscriber): () => void {
    this.init()

    const registry = this.getRegistry(storage)
    let subs = registry.get(key)
    if (!subs) {
      subs = new Set()
      registry.set(key, subs)
    }

    subs.add(cb)

    return () => {
      subs!.delete(cb)
      if (subs!.size === 0) {
        registry.delete(key)
      }
    }
  }

  private init() {
    if (this.initialized || typeof window === 'undefined') return
    this.initialized = true

    window.addEventListener('storage', this.handleEvent)
  }

  private handleEvent = (event: StorageEvent) => {
    if (!event.key || !event.storageArea) return

    const registry = this.getRegistry(event.storageArea)
    const subs = registry.get(event.key)
    if (!subs) return

    for (const cb of subs) {
      cb(event.newValue)
    }
  }

  private getRegistry(storage: Storage) {
    return storage === window.localStorage
      ? this.localSubscriptions
      : this.sessionSubscriptions
  }
}
