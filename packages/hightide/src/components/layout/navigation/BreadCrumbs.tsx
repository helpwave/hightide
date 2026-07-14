import { ArrayUtil } from '@helpwave/hightide-utils'
import clsx from 'clsx'
import type { AnchorHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from 'react'

export type BreadCrumbLinkElementProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export type BreadCrumbLinkProps = BreadCrumbLinkElementProps & { LinkElement?: ElementType<BreadCrumbLinkElementProps> }

const DefaultBreadCrumbLinkElement = 'a'

export const BreadCrumbLink = ({ LinkElement = DefaultBreadCrumbLinkElement, className, ...props } : BreadCrumbLinkProps) => {
  return (
    <LinkElement
      {...props}
      className={clsx('breadcrumb-link', className)}
    />
  )
}

const BreadCrumbDivider = () => {
  return (
    <span data-name="breadcrumb-divider">/</span>
  )
}


type BreadCrumbGroupProps = HTMLAttributes<HTMLUListElement> & {
  divider?: ReactNode | null,
}

/**
 * A component for showing a hierarchical link structure with an independent link on each element
 *
 * e.g. Organizations/Ward/<id>
 */
export const BreadCrumbGroup = ({ children, divider, ...props }: BreadCrumbGroupProps) => {
  const items = ArrayUtil.resolveSingleOrArray(children)

  return (
    <ul {...props} data-name="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <li key={index} data-name="breadcrumb-item">
            {item}
            {!isLast && divider !== null && (divider ?? <BreadCrumbDivider/>)}
          </li>
        )
      })}
    </ul>
  )
}

export type Crumb = {
  href: string,
  label: ReactNode,
}

export type BreadCrumbProps = {
  crumbs: Crumb[],
  LinkElement?: ElementType<BreadCrumbLinkElementProps>,
}

export const BreadCrumbs = ({ crumbs, LinkElement }: BreadCrumbProps) => {
  return (
    <BreadCrumbGroup>
      {crumbs.map(( { href, label }, index) => (
        <BreadCrumbLink key={index} href={href} LinkElement={LinkElement}>
          {label}
        </BreadCrumbLink>
      ))}
    </BreadCrumbGroup>
  )
}