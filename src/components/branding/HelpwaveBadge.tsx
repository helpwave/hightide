import clsx from 'clsx'
import { Tile } from '../layout-and-navigation/Tile'
import { Helpwave } from '../icons-and-geometry/Helpwave'

type Size = 'small' | 'large'

export type HelpwaveBadgeProps = {
  size?: Size,
  title?: string,
  className?: string,
}

/**
 * A Badge with the helpwave logo and the helpwave name
 */
export const HelpwaveBadge = ({
                                size = 'small',
                                title = 'helpwave',
                                className = ''
                              }: HelpwaveBadgeProps) => {
  const iconSize: number = size === 'small' ? 24 : 64

  return (
    <Tile
      prefix={(<Helpwave size={iconSize}/>)}
      title={title}
      titleClassName={size === 'small' ? 'typography-title-md' : 'typography-title-lg'}
      className={clsx(
        {
          'px-2 py-1 rounded-md': size === 'small',
          'px-4 py-1 rounded-md': size === 'large',
        }, className
      )}
    />
  )
}
