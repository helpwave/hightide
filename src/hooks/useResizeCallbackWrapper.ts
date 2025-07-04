import { useEffect } from 'react'

/**
 * A hook that wraps the event listener attachment
 *
 * Make sure your callback is stable (doesn't change every render)
 * This can easily be achieved by wrapping it in a useCallback() and using it inside the useResizeCallbackWrapper
 *
 * @param callback Called when the window resizes
 */
export const useResizeCallbackWrapper = (callback: (event: UIEvent) => void) => {
  useEffect(() => {
    window.addEventListener('resize', callback)

    return () => {
      window.removeEventListener('resize', callback)
    }
  }, [callback])
}