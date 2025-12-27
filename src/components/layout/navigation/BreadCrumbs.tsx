import { ArrayUtil } from '@/src/utils/array'
import Link from 'next/link'
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react'

export type BreadCrumbLinkProps = ComponentProps<typeof Link>

export const BreadCrumbLink = ({ ...props } : BreadCrumbLinkProps) => {
  return (
    <Link
      {...props}
      data-name={props['data-name'] ?? 'breadcrumb-link'}
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
    <ul {...props} data-name={props['data-name'] ?? 'breadcrumb'}>
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
}

export const BreadCrumbs = ({ crumbs }: BreadCrumbProps) => {
  return (
    <BreadCrumbGroup>
      {crumbs.map(( { href, label }, index) => (<BreadCrumbLink key={index} href={href}>{label}</BreadCrumbLink>))}
    </BreadCrumbGroup>
  )
}