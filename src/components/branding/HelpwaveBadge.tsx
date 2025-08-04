import clsx from 'clsx'
import { HelpwaveLogo } from '../icons-and-geometry/HelpwaveLogo'

type Size = 'sm' | 'md' | 'lg'

export type HelpwaveBadgeProps = {
  size?: Size,
  title?: string,
  className?: string,
}

/**
 * A Badge with the helpwave logo and the helpwave name
 */
export const HelpwaveBadge = ({
                                size = 'sm',
                                title = 'helpwave',
                                className = ''
                              }: HelpwaveBadgeProps) => {
  return (
    <span>
      <HelpwaveLogo className={clsx({

      },className)} />
      title={title}
      titleClassName={size === 'sm' ? 'typography-title-md-semibold' : 'typography-title-lg-semibold'}
      className={clsx(
      {
        'px-2 py-1 rounded-md': size === 'sm',
        'px-4 py-1 rounded-md': size === 'lg',
      }, className
    )}
    </span>
  )
}
