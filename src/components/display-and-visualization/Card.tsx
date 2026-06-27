import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback } from 'react'
import clsx from 'clsx'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { Visibility } from '../layout/Visibility'
import { PropsUtil } from '@/src/utils/propsUtil'

export type CardSize = 'sm' | 'md' | 'lg'

type CardHeaderContentProps = {
  title: ReactNode,
  description?: ReactNode,
  leading?: ReactNode,
  trailing?: ReactNode,
}

function CardHeaderContent({ title, description, leading, trailing }: CardHeaderContentProps) {
  return (
    <>
      {leading != null && (
        <span data-name="card-leading">{leading}</span>
      )}
      <div data-name="card-content">
        <span data-name="card-title">{title}</span>
        <Visibility isVisible={!!description}>
          <span data-name="card-description">{description}</span>
        </Visibility>
      </div>
      {trailing != null && (
        <span data-name="card-trailing">{trailing}</span>
      )}
    </>
  )
}

//
// Card
//

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  'title': ReactNode,
  'description'?: ReactNode,
  'size'?: CardSize,
  'leading'?: ReactNode,
  'trailing'?: ReactNode,
  'data-name'?: string,
}

export const Card = ({
  title,
  description,
  size = 'md',
  leading,
  trailing,
  children,
  className,
  ...props
}: CardProps) => {
  return (
    <div
      {...props}
      className={clsx('group/card', className)}
      data-name={props['data-name'] ?? 'card'}
      data-size={size}
    >
      <div data-name="card-header">
        <CardHeaderContent
          title={title}
          description={description}
          leading={leading}
          trailing={trailing}
        />
      </div>
      {children}
    </div>
  )
}

//
// ActionCard
//

export type ActionCardProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  'title': ReactNode,
  'description'?: ReactNode,
  'size'?: CardSize,
  'leading'?: ReactNode,
  'trailing'?: ReactNode,
  'disabled'?: boolean,
  'data-name'?: string,
}

export const ActionCard = forwardRef<HTMLDivElement, ActionCardProps>(function ActionCard({
  title,
  description,
  size = 'md',
  leading,
  trailing,
  disabled = false,
  children,
  className,
  onClick,
  onKeyDown,
  ...props
}, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={clsx('group/card', className)}
      onClick={(event) => {
        if (disabled) {
          return
        }
        onClick?.(event)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (disabled || event.defaultPrevented) {
          return
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          event.currentTarget.click()
        }
      }}
      data-name={props['data-name'] ?? 'action-card'}
      data-size={size}
      data-disabled={PropsUtil.dataAttributes.bool(disabled)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      <div data-name="card-header">
        <CardHeaderContent
          title={title}
          description={description}
          leading={leading}
          trailing={trailing}
        />
      </div>
      {children}
    </div>
  )
})

//
// NavigationCard
//

export type NavigationCardProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  'title': ReactNode,
  'description'?: ReactNode,
  'size'?: CardSize,
  'leading'?: ReactNode,
  'href': string,
  'isExternal'?: boolean,
  'data-name'?: string,
}

export const NavigationCard = forwardRef<HTMLDivElement, NavigationCardProps>(function NavigationCard({
  title,
  description,
  size = 'md',
  leading,
  href,
  isExternal = false,
  children,
  className,
  onClick,
  onKeyDown,
  ...props
}, ref) {
  const navigate = useCallback(() => {
    if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }
    window.location.assign(href)
  }, [href, isExternal])

  return (
    <div
      {...props}
      ref={ref}
      className={clsx('group/card', className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) {
          return
        }
        navigate()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) {
          return
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate()
        }
      }}
      data-name={props['data-name'] ?? 'navigation-card'}
      data-size={size}
      data-external={PropsUtil.dataAttributes.bool(isExternal)}
      role="link"
      tabIndex={0}
    >
      <div data-name="card-header">
        <CardHeaderContent
          title={title}
          description={description}
          leading={leading}
        />
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          data-name="navigation-card-action"
          tabIndex={-1}
          aria-hidden={true}
          onClick={(event) => event.stopPropagation()}
        >
          {isExternal ? (
            <ExternalLink className="size-force-5" />
          ) : (
            <ChevronRight className="size-force-5" />
          )}
        </a>
      </div>
      {children}
    </div>
  )
})
