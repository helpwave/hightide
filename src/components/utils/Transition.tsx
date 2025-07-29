import { useEffect, useState } from 'react'
import type { PropsWithBagFunctionOrChildren } from '@/src'
import { BagFunctionUtil } from '@/src'

type TransitionBag = {
  isOpen: boolean,
  isTransitioning: boolean,
  isUsingReducedMotion: boolean,
  data: { [key: `data-${string}`]: string | undefined },
  handlers: {
    onTransitionEnd?: () => void,
    onAnimationEnd?: () => void,
    onTransitionCancel?: () => void,
  },
}

export type TransitionWrapperProps = PropsWithBagFunctionOrChildren<TransitionBag> & {
  show: boolean,
  includeAnimation?: boolean,
}

/**
 * Only use when you have a transition happening
 */
export function Transition({
                             children,
                             show,
                             includeAnimation = true,
                           }: TransitionWrapperProps) {
  const [isOpen, setIsOpen] = useState<boolean>(show)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(!isOpen)

  const isUsingReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function' ?
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : true

  useEffect(() => {
    setIsOpen(show)
    setIsTransitioning(true)
  }, [show])

  const onAnimationEnd = () => setIsTransitioning(false)

  const bag: TransitionBag = {
    isOpen,
    isTransitioning,
    isUsingReducedMotion,
    data: {
      'data-open': (isOpen && !isTransitioning) ? '' : undefined,
      'data-opening': (isOpen && isTransitioning) ? '' : undefined,
      'data-closing': (!isOpen && isTransitioning) ? '' : undefined,
      'data-closed': (!isOpen && !isTransitioning) ? '' : undefined,
    },
    handlers: {
      onTransitionEnd: () => setIsTransitioning(false),
      onTransitionCancel: () => setIsTransitioning(false),
      onAnimationEnd: includeAnimation ? onAnimationEnd : undefined,
    }
  }

  return BagFunctionUtil.resolve(children, bag)
}