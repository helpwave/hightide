import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { X } from 'lucide-react'
import type { IconButtonProps } from '../../interaction/IconButton'
import { IconButton } from '../../interaction/IconButton'
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
      variant="foreground"
      color="neutral"
      size="sm"

      {...props}

      tooltip={tooltip ?? translation('close')}

      onClick={(event) => {
        handleClose()
        onClick?.(event)
      }}
      icon={X}
    />
  )
}


