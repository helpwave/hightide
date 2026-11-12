function compareDocumentPosition(a: Node | null | undefined, b: Node | null | undefined) {
  if (!a && !b) return 0
  if (!a) return 1
  if (!b) return -1
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

function sortByDocumentOrder(elements: HTMLElement[]) {
  return elements.sort((left, right) => {
    const position = left.compareDocumentPosition(right)
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
}

function focusFirst(elements: HTMLElement[], scrollOptions: ScrollIntoViewOptions) {
  const [first] = sortByDocumentOrder(elements)
  if (!first) return
  first.scrollIntoView(scrollOptions)
  first.focus({ preventScroll: true })
}

export const DOMUtils = {
  compareDocumentPosition,
  sortByDocumentOrder,
  focusFirst,
}

export type DataAttributes = {
  [K in `data-${string}`]?: string | number | boolean
}