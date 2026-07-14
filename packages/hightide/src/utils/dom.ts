function compareDocumentPosition(a: Node | null | undefined, b: Node | null | undefined) {
  if (!a && !b) return 0
  if (!a) return 1
  if (!b) return -1
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

export const DOMUtils = {
  compareDocumentPosition,
}