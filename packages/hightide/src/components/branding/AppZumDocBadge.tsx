import type { HTMLAttributes } from 'react'
import clsx from 'clsx'
import { AppZumDocLogo } from './AppZumDocLogo'

type Size = 'sm' | 'md' | 'lg'

export type AppZumDocBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  size?: Size,
}

export const AppZumDocBadge = ({
  size = 'sm',
  ...props
}: AppZumDocBadgeProps) => {
  return (
    <span
      {...props}
      className={clsx(
        'flex flex-row items-center font-bold font-space rounded-md text-[#057986]',
        {
          'gap-x-1': size === 'sm',
          'gap-x-2 text-lg': size === 'md',
          'gap-x-2 text-xl': size === 'lg'
        },
        props.className
      )}
    >
      <AppZumDocLogo size={size}/>
      App zum Doc
    </span>
  )
}
