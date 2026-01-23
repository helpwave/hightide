'use client'

import type { RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'

export type TransitionState = 'opened' | 'closed' | 'opening' | 'closing'

const reducer = (state: TransitionState, action: 'open' | 'close' | 'finished') : TransitionState => {
  switch (action) {
  case 'open':
    return 'opening'
  case 'close':
    return 'closing'
  case 'finished':{
    if(state === 'opening') {
      return 'opened'
    }
    if(state === 'closing') {
      return 'closed'
    }
    return state
  }
  default:
    return state
  }
}

type UseTransitionStateResult = {
    transitionState: TransitionState,
    isVisible: boolean,
}

type UseTransitionStateProps = {
    isOpen: boolean,
    initialState?: TransitionState,
    ref?: RefObject<HTMLElement>,
    timeout?: number,
}

export const useTransitionState = ({
  isOpen,
  initialState = 'closed',
  ref,
  timeout: initialTimeout = 1000,
}: UseTransitionStateProps): UseTransitionStateResult => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const timer = useRef<NodeJS.Timeout | undefined>(undefined)
  const hasAnimation = useRef<boolean>(false)
  const [timeout] = useState<number>(initialTimeout)

  useEffect(() => {
    if (isOpen && state !== 'opened') {
      dispatch('open')
    } else if (!isOpen && state !== 'closed') {
      dispatch('close')
    }
  }, [isOpen, state])


  useEffect(() => {
    if (state === 'opening' || state === 'closing') {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      if(timeout > 0) {
        timer.current = setTimeout(() => {
          dispatch('finished')
        }, timeout)
      }
    } else {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [state, timeout])

  useLayoutEffect(() => {
    if (ref?.current && (state === 'opening' || state === 'closing')) {
      const animations = ref.current.getAnimations({ subtree: true })
        .filter(animation => animation.effect?.getTiming().duration !== '0s')
      if (animations.length > 0) {
        hasAnimation.current = true
        Promise.all(animations.map(animation => animation.finished))
          .then(() => {
            dispatch('finished')
          })
          .catch(() => {
            dispatch('finished')
          })
      } else {
        dispatch('finished')
      }
    }
  }, [ref, state])

  const onStart = useCallback(() => {
    hasAnimation.current = true
  }, [])

  const onEnd = useCallback(() => {
    dispatch('finished')
    hasAnimation.current = false
  }, [])

  useEffect(() => {
    if (ref?.current && (state === 'opening' || state === 'closing')) {
      const element = ref.current
      element .addEventListener('animationstart', onStart)
      element.addEventListener('animationend', onEnd)
      element.addEventListener('transitionstart', onStart)
      element.addEventListener('transitionend', onEnd)
      element.addEventListener('transitioncancel', onEnd)
      return () => {
        element.removeEventListener('animationstart', onStart)
        element.removeEventListener('animationend', onEnd)
        element.removeEventListener('transitionstart', onStart)
        element.removeEventListener('transitionend', onEnd)
        element.removeEventListener('transitioncancel', onEnd)
      }
    }
  }, [state, ref, onStart, onEnd])

  return {
    transitionState: state,
    isVisible: state !== 'closed',
  }
}