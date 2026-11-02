import type { ComponentPropsWithoutRef } from 'react'
import { forwardRef } from 'react'
import { Menu as MenuIcon } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Icon } from '../../../visualization/Icon'
import { IconButton } from '../../IconButton'
import { useFullScreenVerticalNavigationContext } from './FullScreenVerticalNavigationContext'

export type FullScreenVerticalNavigationTriggerProps = Omit<ComponentPropsWithoutRef<typeof IconButton>, 'onClick' | 'children'>

export const FullScreenVerticalNavigationTrigger = forwardRef<HTMLButtonElement, FullScreenVerticalNavigationTriggerProps>(
  function FullScreenVerticalNavigationTrigger({ tooltip, ...props }, forwardedRef) {
    const translation = useHightideTranslation()
    const { state, dispatch } = useFullScreenVerticalNavigationContext()

    return (
      <IconButton
        {...props}
        ref={forwardedRef}
        tooltip={tooltip ?? translation('menu')}
        variant={props.variant ?? 'foreground'}
        color={props.color ?? 'neutral'}
        aria-haspopup="true"
        aria-expanded={state.isOpen}
        onClick={() => dispatch({ type: 'toggle' })}
      >
        <Icon icon={MenuIcon} />
      </IconButton>
    )
  }
)
