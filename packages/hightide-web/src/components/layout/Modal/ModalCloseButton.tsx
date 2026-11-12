'use client'

import { forwardRef } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import type { IconButtonProps } from '../../interaction/IconButton'
import { IconButton } from '../../interaction/IconButton'
import { useModalContext } from './ModalContext'

export type ModalCloseButtonProps = IconButtonProps

export const ModalCloseButton = forwardRef<HTMLButtonElement, ModalCloseButtonProps>(function ModalCloseButton(
  props,
  ref
) {
  const translation = useHightideTranslation()
  const context = useModalContext()

  return (
    <IconButton
      tooltip={translation('closeDialog')}
      size="sm"
      color="neutral"
      variant="foreground"
      onClick={context.close}
      icon={X}
      {...props}
      ref={ref}
      className={clsx('modal-close-button', props.className)}
    />
  )
})
