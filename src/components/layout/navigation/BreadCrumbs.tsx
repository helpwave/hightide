import { ArrayUtil } from '@/src/utils/array'
import Link from 'next/link'
import clsx from 'clsx'
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react'

export type BreadCrumbLinkProps = ComponentProps<typeof Link>

export const BreadCrumbLink = ({ className, ...props } : BreadCrumbLinkProps) => {
  return (
    <Link
      {...props}
      className={clsx('breadcrumb-link', className)}
    />
  )
}

const BreadCrumbDivider = () => {
  return (
    <span className="breadcrumb-divider">/</span>
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
export const BreadCrumbGroup = ({ children, divider, className, ...props }: BreadCrumbGroupProps) => {
  const items = ArrayUtil.resolveSingleOrArray(children)

  return (
    <ul {...props} className={clsx('breadcrumb', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <li key={index} className="breadcrumb-item">
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
}

export const BreadCrumbs = ({ crumbs }: BreadCrumbProps) => {
  return (
    <BreadCrumbGroup>
      {crumbs.map(( { href, label }, index) => (<BreadCrumbLink key={index} href={href}>{label}</BreadCrumbLink>))}
    </BreadCrumbGroup>
  )
}