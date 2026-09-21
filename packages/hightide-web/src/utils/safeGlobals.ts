export const SafeGlobals = {
  window: (callerId: string): (Window & typeof globalThis) | null => {
    if (typeof window === 'undefined') {
      console.error(`${callerId} tried to access window while it is not defined, ensure this section is only called in safe locations like useEffect`)
      return null
    }
    return window
  },
  document: (callerId: string): Document | null => {
    if (typeof document === 'undefined') {
      console.error(`${callerId} tried to access document while it is not defined, ensure this section is only called in safe locations like useEffect`)
      return null
    }
    return document
  },
}
