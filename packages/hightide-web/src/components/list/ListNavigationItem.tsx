import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType, MouseEvent, ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { Icon } from '../display-and-visualization/Icon'
import { ColoringUtils } from '../../utils/coloring'
import { PropsUtil } from '../../utils/propsUtil'
import { ListItemContent } from './ListItemContent'
import type { ListItemColor, ListItemContentOrder } from './ListItemTypes'

export type ListNavigationLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string,
}

const DefaultListNavigationLink: ElementType<ListNavigationLinkProps> = 'a'

type ListNavigationContentProps = {
  title?: ReactNode,
  subtitle?: ReactNode,
  content?: ReactNode,
  contentOrder?: ListItemContentOrder,
  leading?: ReactNode,
  isExternal?: boolean,
}

function ListNavigationContent({
  title,
  subtitle,
  content,
  contentOrder = 'titleFirst',
  leading,
  isExternal = false,
}: ListNavigationContentProps) {
  return (
    <ListItemContent
      title={title}
      subtitle={subtitle}
      content={content}
      contentOrder={contentOrder}
      leading={leading}
      trailing={(
        <Icon
          icon={isExternal ? ExternalLink : ChevronRight}
          size="sm"
          className="list-navigation-item-icon"
          aria-hidden={true}
        />
      )}
    />
  )
}

type ListNavigationSharedProps = ListNavigationContentProps & {
  color?: ListItemColor,
  disabled?: boolean,
  className?: string,
}

export type ListNavigationItemProps = ListNavigationSharedProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title' | 'content' | 'color' | 'onClick'> & {
  href?: string,
  onClick?: (event: MouseEvent<HTMLElement>) => void,
  LinkComponent?: ElementType<ListNavigationLinkProps>,
}

export function ListNavigationItem({
  title,
  subtitle,
  content,
  contentOrder = 'titleFirst',
  leading,
  isExternal = false,
  color,
  disabled = false,
  className,
  href,
  LinkComponent = DefaultListNavigationLink,
  onClick,
  ...props
}: ListNavigationItemProps) {
  const itemClassName = clsx('list-navigation-item', className)
  const body = (
    <ListNavigationContent
      title={title}
      subtitle={subtitle}
      content={content}
      contentOrder={contentOrder}
      leading={leading}
      isExternal={isExternal}
    />
  )

  if (href) {
    return (
      <LinkComponent
        {...props}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-disabled={disabled || undefined}
        className={itemClassName}
        {...(color
          ? ColoringUtils.build({ color, mode: 'interactive', colorVariant: 'tonal' })
          : ColoringUtils.dataColoringMode('interactive'))}
        data-disabled={PropsUtil.dataAttributes.bool(disabled)}
        data-external={PropsUtil.dataAttributes.bool(isExternal)}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault()
            return
          }
          onClick?.(event)
        }}
      >
        {body}
      </LinkComponent>
    )
  }

  return (
    <button
      {...(props as unknown as ButtonHTMLAttributes<HTMLButtonElement>)}
      type="button"
      disabled={disabled}
      className={itemClassName}
      {...(color
        ? ColoringUtils.build({ color, mode: 'interactive', colorVariant: 'tonal' })
        : ColoringUtils.dataColoringMode('interactive'))}
      data-disabled={PropsUtil.dataAttributes.bool(disabled)}
      onClick={(event) => onClick?.(event)}
    >
      {body}
    </button>
  )
}
