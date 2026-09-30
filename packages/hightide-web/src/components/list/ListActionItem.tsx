import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

import { ColoringUtils } from '../../utils/coloring'
import { PropsUtil } from '../../utils/propsUtil'
import { ListItemContent } from './ListItemContent'
import type { ListItemColor, ListItemContentOrder, ListItemContentProps } from './ListItemTypes'

export type ListActionItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'content' | 'color'> & Omit<ListItemContentProps, 'contentOrder'> & {
  contentOrder?: ListItemContentOrder,
  color?: ListItemColor,
}

export function ListActionItem({
  title,
  subtitle,
  content,
  contentOrder = 'titleFirst',
  leading,
  trailing,
  color,
  disabled = false,
  className,
  type,
  ...props
}: ListActionItemProps) {
  return (
    <button
      {...props}
      type={type ?? 'button'}
      disabled={disabled}
      className={clsx('list-action-item', className)}
      {...(color
        ? ColoringUtils.build({ color, mode: 'interactive', colorVariant: 'tonal' })
        : ColoringUtils.dataColoringMode('interactive'))}
      data-disabled={PropsUtil.dataAttributes.bool(disabled)}
    >
      <ListItemContent
        title={title}
        subtitle={subtitle}
        content={content}
        contentOrder={contentOrder}
        leading={leading}
        trailing={trailing}
      />
    </button>
  )
}
