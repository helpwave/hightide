'use client'

import type { MutableRefObject } from 'react'
import { useId } from 'react'
import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { useIsMounted } from '@/src/hooks/focus/useIsMounted'

type TrapCallback = (activeId?: string) => void

class FocusTrapService {
  // The last entry is always the active one
  private listeners: { id: string, callback: TrapCallback }[] = []

  public getActive() {
    if (this.listeners.length === 0) return undefined
    return this.listeners[this.listeners.length - 1]
  }

  private notify() {
    const active = this.getActive()
    this.listeners.forEach(({ callback }) => callback(active?.id))
  }

  register(id: string, callback: TrapCallback) {
    this.listeners.push({ id, callback })
    this.notify()
  }

  unregister(id: string) {
    const index = this.listeners.findIndex(trap => trap.id === id)
    if (index !== -1) {
      const isActive = index === this.listeners.length - 1
      this.listeners.splice(index, 1)
      if (isActive) {
        this.notify()
      }
    } else {
      console.warn(`Unable to unregister id ${id}: not found`)
    }
  }
}

const service = new FocusTrapService()

export type UseFocusTrapProps = {
  container: MutableRefObject<HTMLElement>,
  active?: boolean,
  initialFocus?: MutableRefObject<HTMLElement>,
}

export const useFocusTrap = ({
                               container,
                               active = true,
                               initialFocus
                             }: UseFocusTrapProps) => {
  const lastFocusRef = useRef<HTMLElement | null>(null)
  const [paused, setPaused] = useState(false)
  const isMounted = useIsMounted()
  const id = useId()

  useEffect(() => {
    if (active) {
      function callback(activeId?: string) {
        console.log(activeId)
        setPaused(activeId !== id)
      }

      service.register(id, callback)
      return () => service.unregister(id)
    }
  }, [active, id])



  useEffect(() => {
    if (active && !paused && isMounted) {
      if(!lastFocusRef.current) {
        lastFocusRef.current = document.activeElement as HTMLElement
      }
      const containerElement = container.current

      function onFocusIn(event: FocusEvent) {
        if (!containerElement.contains(event.target as HTMLElement)) {
          // Try in the following order
          // 1. Focus the initial element
          // 2. Focus the first focusable element in the container
          // 3. Focus the container
          if (initialFocus?.current) {
            initialFocus.current.focus()
          } else {
            const elements = containerElement?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
            if (elements && elements.length > 0) {
              const first = elements.item(0) as HTMLElement
              first.focus()
            } else {
              containerElement.focus()
            }
          }
        }
      }

      function onKeyDown(event: KeyboardEvent) {
        const key = event.key
        const elements = containerElement?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        const active = document.activeElement as HTMLElement
        const index = [...elements].findIndex(value => value === active)
        if (index === -1 || event.altKey || event.ctrlKey || event.metaKey) {
          return
        }
        if (key === 'Tab' && !event.shiftKey) {
          const nextIndex = (index + 1) % elements.length
          const nextElement = elements[nextIndex] as HTMLElement
          nextElement.focus()
          event.preventDefault()
        } else if (key === 'Tab' && event.shiftKey) {
          const nextIndex = (index - 1 + elements.length) % elements.length
          const nextElement = elements[nextIndex] as HTMLElement
          nextElement.focus()
          event.preventDefault()
        }
      }

      // Try in the following order
      // 1. Focus the initial element
      // 2. Focus the first focusable element in the container
      // 3. Focus the container
      if (initialFocus?.current) {
        initialFocus.current.focus()
      } else {
        const elements = containerElement?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (elements && elements.length > 0) {
          const first = elements.item(0) as HTMLElement
          first.focus()
        } else {
          containerElement.focus()
        }
      }

      // Register and unregister the listeners
      containerElement.addEventListener('keydown', onKeyDown)
      document.addEventListener('focusin', onFocusIn)
      return () => {
        if (!paused) {
          lastFocusRef.current?.focus()
        }
        containerElement.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('focusin', onFocusIn)
      }
    }
  }, [active, paused, isMounted, container, initialFocus])
}