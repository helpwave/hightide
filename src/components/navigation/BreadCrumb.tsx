import Link from 'next/link'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Fragment } from 'react'

export type Crumb = {
  display: ReactNode,
  link: string,
}

type BreadCrumbProps = {
  crumbs: Crumb[],
  linkClassName?: string,
  containerClassName?: string,
}

/**
 * A component for showing a hierarchical link structure with an independent link on each element
 *
 * e.g. Organizations/Ward/<id>
 */
export const BreadCrumb = ({ crumbs, linkClassName, containerClassName }: BreadCrumbProps) => {
  return (
    <div className={clsx('flex-row-0.5 items-center', containerClassName)}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1
        return (
          <Fragment key={index}>
            <Link
              href={crumb.link}
              className={clsx(
                'btn-sm coloring-text-hover',
                {
                  description: !isLast,
                  neutral: isLast,
                },
                linkClassName
              )}
            >
              {crumb.display}
            </Link>
            {!isLast && <span className={clsx(`px-1`, 'text-description')}>/</span>}
          </Fragment>
        )
      })}
    </div>
  )
}
