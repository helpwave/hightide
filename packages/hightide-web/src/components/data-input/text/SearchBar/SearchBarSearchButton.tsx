import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { Search } from 'lucide-react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { IconButton } from '../../../interaction/IconButton'
import { Icon } from '../../../visualization/Icon'
import { useSearchBarContext } from './SearchBarContext'

export type SearchBarSearchButtonProps = ComponentProps<typeof IconButton>

export const SearchBarSearchButton = forwardRef<HTMLButtonElement, SearchBarSearchButtonProps>(function SearchBarSearchButton(
  props,
  forwardedRef
) {
  const translation = useHightideTranslation()
  const { state, dispatch } = useSearchBarContext()

  return (
    <IconButton
      {...props}
      ref={forwardedRef}
      tooltip={translation('search')}
      size="sm"
      color="neutral"
      variant="foreground"
      onClick={(event) => {
        props.onClick?.(event)
        dispatch({ type: 'commit', value: state.value })
      }}
      className={clsx('search-bar-icon-button', props.className)}
    >
      <Icon icon={Search} size="sm" className="search-bar-icon" />
    </IconButton>
  )
})
