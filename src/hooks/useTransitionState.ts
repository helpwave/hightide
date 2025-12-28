import { useCallback, useEffect, useId, useRef, useState } from 'react'

export type TransitionState = 'opened' | 'closed' | 'opening' | 'closing'

type UseTransitionStateResult = {
    transitionState: TransitionState,
    isVisible: boolean,
    callbacks: {
        onAnimationStart: () => void,
        onAnimationEnd: () => void,
        onTransitionStart: () => void,
        onTransitionEnd: () => void,
        onTransitionCancel: () => void,
    },
}

type UseTransitionStateProps = {
    isOpen: boolean,
}

export const useTransitionState = ({ isOpen }: UseTransitionStateProps): UseTransitionStateResult => {
  const [hasTransitionFinished, setHasTransitionFinished] = useState(true)
  const [currentOpen, setCurrentOpen] = useState(isOpen)

  const isAnimating = useRef(false)
  const timer = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (isOpen === currentOpen) {
      return
    }

    setHasTransitionFinished(false)
    setCurrentOpen(isOpen)
    isAnimating.current = false

    const checkAnimationStart = () => {
      timer.current = setTimeout(() => {
        if (!isAnimating.current) {
          setHasTransitionFinished(true)
        }
      }, 50)
    }
    checkAnimationStart()

    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [isOpen, currentOpen])

  const onStart = useCallback(() => {
    isAnimating.current = true
  }, [])

  const onEnd = useCallback(() => {
    setHasTransitionFinished(true)
    isAnimating.current = false
  }, [])

  const transitionState: TransitionState = currentOpen
    ? hasTransitionFinished
      ? 'opened'
      : 'opening'
    : hasTransitionFinished
      ? 'closed'
      : 'closing'

  return {
    transitionState,
    isVisible: transitionState !== 'closed',
    callbacks: {
      onAnimationStart: onStart,
      onAnimationEnd: onEnd,
      onTransitionStart: onStart,
      onTransitionEnd: onEnd,
      onTransitionCancel: onEnd,
    },
  }
}