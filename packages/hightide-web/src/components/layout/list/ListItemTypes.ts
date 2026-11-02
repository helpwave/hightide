import type { ReactNode } from 'react'

export type ListItemColor = 'primary' | 'secondary' | 'positive' | 'warning' | 'negative' | 'neutral'

export type ListItemContentOrder = 'titleFirst' | 'subtitleFirst'

export type ListItemContentProps = {
  title?: ReactNode,
  subtitle?: ReactNode,
  content?: ReactNode,
  contentOrder?: ListItemContentOrder,
  leading?: ReactNode,
  trailing?: ReactNode,
}
