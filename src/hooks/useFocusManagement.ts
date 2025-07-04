import { useCallback } from 'react'

export function useFocusManagement() {
  const getFocusableElements = useCallback((): HTMLElement[] => {
    return Array.from(
      document.querySelectorAll(
        'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        !el.hasAttribute('disabled') &&
        !el.hasAttribute('hidden') &&
        el.tabIndex !== -1
    )
  }, [])

  const getNextFocusElement = useCallback((): HTMLElement | undefined => {
    const elements = getFocusableElements()
    if(elements.length === 0) {
      return undefined
    }
    let nextElement = elements[0]
    if(document.activeElement instanceof HTMLElement) {
      const currentIndex = elements.indexOf(document.activeElement)
      nextElement = elements[(currentIndex + 1) % elements.length]
    }
    return nextElement
  }, [getFocusableElements])

  const focusNext = useCallback(() => {
    const nextElement = getNextFocusElement()
    nextElement?.focus()
  }, [getNextFocusElement])

  const getPreviousFocusElement = useCallback((): HTMLElement | undefined => {
    const elements = getFocusableElements()
    if(elements.length === 0) {
      return undefined
    }
    let previousElement = elements[0]
    if(document.activeElement instanceof HTMLElement) {
      const currentIndex = elements.indexOf(document.activeElement)
      if(currentIndex === 0) {
        previousElement = elements[elements.length - 1]
      } else {
        previousElement = elements[currentIndex - 1]
      }
    }
    return previousElement
  }, [getFocusableElements])

  const focusPrevious = useCallback(() => {
    const previousElement = getPreviousFocusElement()
    if (previousElement) previousElement.focus()
  }, [getPreviousFocusElement])

  return {
    getFocusableElements,
    getNextFocusElement,
    getPreviousFocusElement,
    focusNext,
    focusPrevious,
  }
}