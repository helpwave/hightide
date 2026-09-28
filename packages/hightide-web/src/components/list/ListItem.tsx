import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

import { ListItemContent } from './ListItemContent'
import type { ListItemColor, ListItemContentOrder, ListItemContentProps } from './ListItemTypes'

export type ListItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'content' | 'color'> & Omit<ListItemContentProps, 'contentOrder'> & {
  contentOrder?: ListItemContentOrder,
  color?: ListItemColor,
}

export function ListItem({
  title,
  subtitle,
  content,
  contentOrder = 'subtitleFirst',
  leading,
  trailing,
  color,
  className,
  ...props
}: ListItemProps) {
  return (
    <div
      {...props}
      className={clsx('list-item', color, color && 'coloring-tonal', className)}
      data-color={color}
    >
      <ListItemContent
        title={title}
        subtitle={subtitle}
        content={content}
        contentOrder={contentOrder}
        leading={leading}
        trailing={trailing}
      />
    </div>
  )
}
