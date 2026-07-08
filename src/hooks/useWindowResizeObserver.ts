import { useEffect } from 'react'

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
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])
}