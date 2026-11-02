import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type SearchBarLayoutProps = HTMLAttributes<HTMLDivElement>

export const SearchBarLayout = forwardRef<HTMLDivElement, SearchBarLayoutProps>(function SearchBarLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('search-bar-container group/search-bar', props.className)}
    />
  )
})
