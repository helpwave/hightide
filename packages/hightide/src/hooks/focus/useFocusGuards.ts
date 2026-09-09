import { useEffect } from 'react'
import { SafeGlobals } from '../../utils/safeGlobals'

const selectorName = 'data-hw-focus-guard'

function FocusGuard() {
  const doc = SafeGlobals.document('useFocusGuards.FocusGuard')
  if (!doc) return
  const element = doc.createElement('div')
  element.setAttribute(selectorName, '')
  element.tabIndex = 0
  element.style.border = 'none'
  element.style.outline = 'none'
  element.style.boxShadow = 'none'
  element.style.opacity = '0'
  element.style.position = 'fixed'
  element.style.pointerEvents = 'none'
  return element
}

class FocusGuardsService {
  private count: number = 0

  private static instance: FocusGuardsService

  private constructor() {}

  static getInstance(): FocusGuardsService {
    if (!FocusGuardsService.instance) {
      FocusGuardsService.instance = new FocusGuardsService()
    }
    return FocusGuardsService.instance
  }

  add() {
    const doc = SafeGlobals.document('useFocusGuards.add')
    if (!doc?.body) return
    const edgeGuards = doc.querySelectorAll(`[${selectorName}]`)
    const start = edgeGuards[0] ?? FocusGuard()
    const end = edgeGuards[1] ?? FocusGuard()
    if (!start || !end) return
    doc.body.insertAdjacentElement('afterbegin', start)
    doc.body.insertAdjacentElement('beforeend', end)
    this.count++
  }

  remove() {
    if (this.count === 1) {
      const doc = SafeGlobals.document('useFocusGuards.remove')
      doc?.querySelectorAll(`[${selectorName}]`).forEach((node) => node.remove())
    }
    this.count--
  }
}

export const useFocusGuards = () => {
  useEffect(() => {
    FocusGuardsService.getInstance().add()
    return () => {
      FocusGuardsService.getInstance().remove()
    }
  }, [])
}
