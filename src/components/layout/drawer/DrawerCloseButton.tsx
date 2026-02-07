import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { X } from 'lucide-react'
import type { IconButtonProps } from '../../user-interaction/IconButton'
import { IconButton } from '../../user-interaction/IconButton'
import { useDrawerContext } from './DrawerContext'

export type DrawerCloseButtonProps = IconButtonProps

export function DrawerCloseButton({
  tooltip,
  onClick,
  ...props
}: DrawerCloseButtonProps) {
  const translation = useHightideTranslation()
  const { setOpen } = useDrawerContext()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <IconButton
      coloringStyle="text"
      color="neutral"
      size="sm"

      {...props}

      tooltip={tooltip ?? translation('close')}
      onClick={(event) => {
        handleClose()
        onClick?.(event)
      }}
    >
      <X />
    </IconButton>
  )
}


