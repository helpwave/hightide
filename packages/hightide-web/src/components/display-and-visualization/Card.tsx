import type { AnchorHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import clsx from 'clsx'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { Visibility } from '../layout/Visibility'
import { PropsUtil } from '../../utils/propsUtil'

export type CardSize = 'sm' | 'md' | 'lg'

type CardHeaderContentProps = {
  title: ReactNode,
  titleId?: string,
  description?: ReactNode,
  descriptionId?: string,
  leading?: ReactNode,
  trailing?: ReactNode,
}

function CardHeaderContent({
  title,
  titleId,
  description,
  descriptionId,
  leading,
  trailing,
}: CardHeaderContentProps) {
  return (
    <>
      {leading != null && (
        <span className="card-leading">{leading}</span>
      )}
      <div className="card-content">
        <span id={titleId} className="card-title">{title}</span>
        <Visibility isVisible={!!description}>
          <span id={descriptionId} className="card-description">{description}</span>
        </Visibility>
      </div>
      {trailing != null && (
        <span className="card-trailing">{trailing}</span>
      )}
    </>
  )
}

//
// Card
//

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: ReactNode,
  description?: ReactNode,
  size?: CardSize,
  leading?: ReactNode,
  trailing?: ReactNode,
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
      className={clsx('group/card card', className)}
      data-size={size}
    >
      <div className="card-header">
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
  title: ReactNode,
  description?: ReactNode,
  size?: CardSize,
  leading?: ReactNode,
  trailing?: ReactNode,
  disabled?: boolean,
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
      className={clsx('card group/card action-card', className)}
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
      data-size={size}
      data-disabled={PropsUtil.dataAttributes.bool(disabled)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      <div className="card-header">
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


export type NavigationCardLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string,
}

const DefaultNavigationCardLink: ElementType<NavigationCardLinkProps> = 'a'

//
// NavigationCard
//

export type NavigationCardProps = Omit<HTMLAttributes<HTMLAnchorElement>, 'title'> & {
  title: ReactNode,
  description?: ReactNode,
  size?: CardSize,
  leading?: ReactNode,
  href: string,
  isExternal?: boolean,
  LinkComponent?: ElementType<NavigationCardLinkProps>,
}

export const NavigationCard = forwardRef<HTMLAnchorElement, NavigationCardProps>(function NavigationCard({
  title,
  description,
  size = 'md',
  leading,
  href,
  isExternal = false,
  LinkComponent = DefaultNavigationCardLink,
  children,
  className,
  ...props
}, ref) {
  const generatedId = useId()
  const descriptionId = `navigation-card-description-${generatedId}`
  const titleId = `navigation-card-title-${generatedId}`

  return (
    <LinkComponent
      {...props}
      ref={ref}
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}

      data-size={size}
      data-external={PropsUtil.dataAttributes.bool(isExternal)}

      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}

      className={clsx('card group/card navigation-card', className)}
    >
      <div className="card-header">
        <CardHeaderContent
          title={title}
          titleId={titleId}
          description={description}
          descriptionId={description ? descriptionId : undefined}
          leading={leading}
        />
        <span className="navigation-card-action">
          {isExternal ? (
            <ExternalLink className="navigation-card-action-icon" aria-hidden="true" />
          ) : (
            <ChevronRight className="navigation-card-action-icon" aria-hidden="true" />
          )}
        </span>
      </div>
      {children}
    </LinkComponent>
  )
})
