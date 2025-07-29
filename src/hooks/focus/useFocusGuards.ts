const selectorName = 'data-hw-focus-guard'

function FocusGuard() {
  const element = document.createElement('div')
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
    const edgeGuards = document.querySelectorAll(`[${selectorName}]`)
    document.body.insertAdjacentElement('afterbegin', edgeGuards[0] ?? FocusGuard())
    document.body.insertAdjacentElement('beforeend', edgeGuards[1] ?? FocusGuard())
    this.count++
  }

  remove() {
    if (this.count === 1) {
      document.querySelectorAll(`[${selectorName}]`)
        .forEach((node) => node.remove())
    }
    this.count--
  }
}

export const useFocusGuards = () => {
  FocusGuardsService.getInstance().add()
  return () => {
    FocusGuardsService.getInstance().remove()
  }
}