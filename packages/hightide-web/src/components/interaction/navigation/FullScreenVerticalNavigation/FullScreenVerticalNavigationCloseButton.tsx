import type { ComponentPropsWithoutRef } from 'react'
import { forwardRef } from 'react'
import { XIcon } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Icon } from '../../../visualization/Icon'
import { IconButton } from '../../IconButton'
import { useFullScreenVerticalNavigationContext } from './FullScreenVerticalNavigationContext'

export type FullScreenVerticalNavigationCloseButtonProps = Omit<ComponentPropsWithoutRef<typeof IconButton>, 'onClick' | 'children'>

export const FullScreenVerticalNavigationCloseButton = forwardRef<HTMLButtonElement, FullScreenVerticalNavigationCloseButtonProps>(
  function FullScreenVerticalNavigationCloseButton({ tooltip, className, ...props }, forwardedRef) {
    const translation = useHightideTranslation()
    const { dispatch } = useFullScreenVerticalNavigationContext()

    return (
      <IconButton
        {...props}
        ref={forwardedRef}
        className={className}
        tooltip={tooltip ?? translation('close')}
        variant={props.variant ?? 'foreground'}
        color={props.color ?? 'neutral'}
        onClick={() => dispatch({ type: 'close' })}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            dispatch({ type: 'close' })
          }
        }}
      >
        <Icon icon={XIcon} />
      </IconButton>
    )
  }
)
