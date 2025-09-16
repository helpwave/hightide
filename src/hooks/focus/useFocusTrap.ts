'use client'

import type { MutableRefObject } from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { useIsMounted } from '@/src/hooks/focus/useIsMounted'

const createFocusGuard = () => {
  const div = document.createElement('div')
  Object.assign(div.style, {
    opacity: '0',
    outline: 'none',
    boxShadow: 'none',
    position: 'fixed',
    pointerEvents: 'none',
    touchAction: 'none',
  })
  div.tabIndex = 0
  div.setAttribute('data-hw-focus-guard', '')
  document.body.appendChild(div)
  return div
}

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

  private removeGuards() {
    document.querySelectorAll('[data-hw-focus-guard]').forEach((node) => node.remove())
  }

  private addGuards() {
    document.body.insertAdjacentElement('afterbegin', createFocusGuard())
    document.body.insertAdjacentElement('beforeend', createFocusGuard())
  }

  register(id: string, callback: TrapCallback) {
    this.listeners.push({ id, callback })
    if (this.listeners.length === 1) {
      this.addGuards()
    }
    this.notify()
  }

  unregister(id: string) {
    const index = this.listeners.findIndex(trap => trap.id === id)
    if (index !== -1) {
      const isActive = index === this.listeners.length - 1
      this.listeners.splice(index, 1)
      if (isActive) {
        this.removeGuards()
        this.notify()
        if (this.listeners.length > 0) {
          this.addGuards()
        }
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
  /**
   * Whether to focus the first element when the initialFocus isn't provided
   *
   * Focuses the container instead
   */
  focusFirst?: boolean,
}

export const useFocusTrap = ({
                               container,
                               active = true,
                               initialFocus,
                               focusFirst = true,
                             }: UseFocusTrapProps) => {
  const lastFocusRef = useRef<HTMLElement | null>(null)
  const [paused, setPaused] = useState(false)
  const isMounted = useIsMounted()
  const id = useId()

  useEffect(() => {
    if (active) {
      function callback(activeId?: string) {
        setPaused(activeId !== id)
      }

      service.register(id, callback)
      return () => service.unregister(id)
    }
  }, [active, id])

  useEffect(() => {
    if (active && !paused && isMounted) {
      if (!lastFocusRef.current) {
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
      // 2. Focus the first focusable element in the container (if focusFirst)
      // 2. Focus the container
      if (initialFocus?.current) {
        initialFocus.current.focus()
      } else {
        const elements = containerElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (focusFirst && elements && elements.length > 0) {
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
        containerElement.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('focusin', onFocusIn)
        if (!paused) {
          lastFocusRef.current?.focus()
        }
      }
    }
  }, [active, paused, isMounted, container, initialFocus, focusFirst])
}