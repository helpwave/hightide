'use client'

import type { MutableRefObject } from 'react'
import { useCallback } from 'react'
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

function getContainedFocusableElements(element: HTMLElement) {
  return element?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
}

type ListenerType = {
  id: string,
  pause: () => void,
  unpause: () => void,
  focus: () => void,
  focusLast: () => void,
}

class FocusTrapService {
  // The last entry is always the active one
  private listeners: ListenerType[] = []

  public getActive() {
    if (this.listeners.length === 0) return undefined
    return this.listeners[this.listeners.length - 1]
  }

  private notify(isUnpause: boolean) {
    const active = this.getActive()
    this.listeners.forEach((listener) => {
      const { focus, pause, unpause } = listener
      if(listener === active) {
        if(isUnpause) {
          unpause()
        } else{
          focus()
        }
      } else {
        pause()
      }
    })
  }

  private removeGuards() {
    document.querySelectorAll('[data-hw-focus-guard]').forEach((node) => node.remove())
  }

  private addGuards() {
    document.body.insertAdjacentElement('afterbegin', createFocusGuard())
    document.body.insertAdjacentElement('beforeend', createFocusGuard())
  }

  register(listener: ListenerType) {
    this.listeners.push(listener)
    if (this.listeners.length === 1) {
      this.addGuards()
    }
    this.notify(false)
  }

  unregister(id: string) {
    const index = this.listeners.findIndex(trap => trap.id === id)
    if (index !== -1) {
      const isActive = index === this.listeners.length - 1
      const listener = this.listeners[index]
      this.listeners.splice(index, 1)
      if (isActive) {
        this.removeGuards()
        listener.focusLast()
        this.notify(true)
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

  const focusElement = useCallback(() => {
    const containerElement = container.current
    // Try in the following order
    // 1. Focus the initial element
    // 2. Focus the first focusable element in the container
    // 3. Focus the container
    if (initialFocus?.current) {
      initialFocus.current.focus()
    } else {
      const elements = getContainedFocusableElements(containerElement)
      if (elements && elements.length > 0) {
        const first = elements.item(0) as HTMLElement
        first.focus()
      } else {
        containerElement.focus()
      }
    }
  }, [container, initialFocus])

  useEffect(() => {
    if (active && isMounted) {
      if (!lastFocusRef.current) {
        lastFocusRef.current = document.activeElement as HTMLElement
      }
      function pause() {
        setPaused(true)
      }
      function unpause() {
        setPaused(false)
        if(!container.current.contains(document.activeElement as HTMLElement)) {
          focusElement()
        }
      }
      function focus() {
        focusElement()
        setPaused(false)
      }
      function focusLast() {
        lastFocusRef.current?.focus()
      }

      service.register({ id, pause, focus, focusLast, unpause })
      return () => {
        service.unregister(id)
      }
    }
  }, [active, container, focusElement, id, isMounted])

  useEffect(() => {
    if (active && !paused && isMounted) {
      const containerElement = container.current

      function onFocusIn(event: FocusEvent) {
        if (!containerElement.contains(event.target as HTMLElement)) {
          focus()
        }
      }

      function onKeyDown(event: KeyboardEvent) {
        const key = event.key
        const elements = getContainedFocusableElements(containerElement)
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

      // Register and unregister the listeners
      containerElement.addEventListener('keydown', onKeyDown)
      document.addEventListener('focusin', onFocusIn)
      return () => {
        containerElement.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('focusin', onFocusIn)
      }
    }
  }, [active, paused, isMounted, container, initialFocus, focusFirst])
}