import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import clsx from 'clsx'

type ScrollableListBaseProps = {
  header?: ReactNode,
  footer?: ReactNode,
  footerClassName?: string,
  headerClassName?: string,
  contentClassName?: string,
}

export type ScrollableListProps<E extends ElementType = 'div'> = ScrollableListBaseProps & {
  as?: E,
} & Omit<ComponentPropsWithoutRef<E>, keyof ScrollableListBaseProps | 'as'>

export const ScrollableList = <E extends ElementType = 'div'>({
  as,
  header,
  footer,
  footerClassName,
  headerClassName,
  contentClassName,
  className,
  children,
  ...props
}: ScrollableListProps<E>) => {
  const Component = (as ?? 'div') as ElementType

  return (
    <Component {...props} className={clsx('scrollable-list', className)}>
      {header && (
        <div className={clsx('scrollable-list-header', headerClassName)}>
          {header}
        </div>
      )}
      <div className={clsx('scrollable-list-content', contentClassName)}>
        {children}
      </div>
      {footer && (
        <div className={clsx('scrollable-list-footer', footerClassName)}>
          {footer}
        </div>
      )}
    </Component>
  )
}
