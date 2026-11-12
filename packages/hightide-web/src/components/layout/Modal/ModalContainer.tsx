'use client'

import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

import { Portal } from '../Portal'
import { Visibility } from '../Visibility'
import { PropsUtil } from '../../../utils/propsUtil'
import { useModalContext } from './ModalContext'

export type ModalContainerProps = HTMLAttributes<HTMLDivElement>

export const ModalContainer = forwardRef<HTMLDivElement, ModalContainerProps>(function ModalContainer({
  children,
  ...props
}, externalRef) {
  const { close, containerRef, ids, state, transitionState, zIndex } = useModalContext()
  const isVisible = transitionState !== 'closed'

  return (
    <Visibility isVisible={isVisible}>
      <Portal>
        <div
          {...props}
          ref={ReactUtils.assingRefsBuilder([containerRef, externalRef])}
          id={props.id ?? ids.container}
          data-open={PropsUtil.dataAttributes.bool(state.isOpen)}
          className={clsx('modal-container', props.className)}
          style={{ ...props.style, zIndex }}
          onKeyDown={(event) => {
            props.onKeyDown?.(event)
            if (event.key !== 'Escape' || event.defaultPrevented) {
              return
            }
            event.preventDefault()
            close()
          }}
        >
          {children}
        </div>
      </Portal>
    </Visibility>
  )
})
