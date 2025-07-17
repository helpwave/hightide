import Link from 'next/link'
import clsx from 'clsx'

export type Crumb = {
  display: string,
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
  const color = 'text-description'

  return (
    <div className={clsx('flex-row-0.5 items-center', containerClassName)}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1
        return (
          <>
            <Link
              key={'breadcrumb-'+ index}
              href={crumb.link}
              className={clsx('btn-sm hover:bg-description/20', linkClassName, { [color]: !isLast })}
            >
              {crumb.display}
            </Link>
            {!isLast && <span key={'breadcrumb-slash-'+ index} className={clsx(`px-1`, color)}>/</span>}
          </>
        )
      })}
    </div>
  )
}
