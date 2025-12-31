import { HelpwaveLogo } from './HelpwaveLogo'
import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type Size = 'sm' | 'md' | 'lg'

export type HelpwaveBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  size?: Size,
}

/**
 * A Badge with the helpwave logo and the helpwave name
 */
export const HelpwaveBadge = ({
  size = 'sm',
  ...props
}: HelpwaveBadgeProps) => {
  return (
    <span
      {...props}
      className={clsx(
        'flex flex-row items-center font-bold font-space rounded-md',
        {
          'px-2 py-1': size === 'sm' || size === 'md',
          'px-4 py-1': size === 'lg',
          'gap-x-1': size === 'sm',
          'gap-x-2 text-lg': size === 'md',
          'gap-x-2 text-xl': size === 'lg'
        }, props.className
      )}
    >
      <HelpwaveLogo size={size}/>
      helpwave
    </span>
  )
}
