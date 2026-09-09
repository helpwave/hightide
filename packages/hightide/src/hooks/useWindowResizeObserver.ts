import { useEffect } from 'react'
import { SafeGlobals } from '../utils/safeGlobals'

/**
 * A hook that wraps the event listener attachment
 *
 * Make sure your callback is stable (doesn't change every render)
 * This can easily be achieved by wrapping it in a useCallback() and using it inside the useResizeCallbackWrapper
 *
 * @param callback Called when the window resizes
 */
export const useWindowResizeObserver = (onResize: () => void) => {
  useEffect(() => {
    const win = SafeGlobals.window('useWindowResizeObserver')
    if (!win) return
    win.addEventListener('resize', onResize)

    return () => {
      win.removeEventListener('resize', onResize)
    }
  }, [onResize])
}