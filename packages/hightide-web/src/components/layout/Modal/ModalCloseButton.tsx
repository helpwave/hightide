'use client'

import clsx from 'clsx'
import { X } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { Visibility } from '../Visibility'
import type { IconButtonProps } from '../../interaction/IconButton'
import { IconButton } from '../../interaction/IconButton'
import { useModalContext } from './ModalContext'

export type ModalCloseButtonProps = IconButtonProps

export function ModalCloseButton({
  ...props
}: ModalCloseButtonProps) {
  const translation = useHightideTranslation()
  const context = useModalContext()
  if (!context.onClose) {
    throw new Error('Modal.CloseButton must be used within a Modal.Container')
  }

  return (
    <Visibility isVisible={context.isClosable}>
      <IconButton
        tooltip={translation('closeDialog')}
        size="md"
        color="neutral"
        variant="foreground"
        onClick={context.onClose}
        icon={X}
        {...props}
        className={clsx('modal-close-button', props.className)}
      />
    </Visibility>
  )
}
