import type { ComponentRef, CSSProperties, ElementType, ReactNode, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import clsx from 'clsx'
import { BreadCrumbsContext } from './BreadCrumbsContext'
import {
  BreadCrumbsDivider,
  type BreadCrumbsDividerProps
} from './BreadCrumbsDivider'
import {
  BreadCrumbsItem,
  type BreadCrumbsItemProps
} from './BreadCrumbsItem'
import {
  BreadCrumbsLayout,
  type BreadCrumbsLayoutProps
} from './BreadCrumbsLayout'
import type { BreadCrumbLinkElementProps } from './BreadCrumbsContext'
import {
  BreadCrumbsLink,
  type BreadCrumbsLinkProps
} from './BreadCrumbsLink'

export type Crumb = {
  href: string,
  label: ReactNode,
  className?: string,
  style?: CSSProperties,
}

export type BreadCrumbProps = {
  crumbs: Crumb[],
  LinkElement?: ElementType<BreadCrumbLinkElementProps>,
  divider?: ReactNode | null,
  layoutRef?: Ref<ComponentRef<typeof BreadCrumbsLayout>>,
  layoutProps?: BreadCrumbsLayoutProps,
  itemProps?: BreadCrumbsItemProps,
  linkProps?: BreadCrumbsLinkProps,
  dividerProps?: BreadCrumbsDividerProps,
}

export type BreadCrumbsProps = BreadCrumbProps

const BreadCrumbsComponent = ({
  crumbs,
  LinkElement,
  divider,
  layoutRef,
  layoutProps,
  itemProps,
  linkProps,
  dividerProps,
}: BreadCrumbProps) => (
  <BreadCrumbsContext.Provider value={{ LinkElement }}>
    <BreadCrumbsLayout
      {...layoutProps}
      ref={ReactUtils.assingRefsBuilder([layoutRef])}
    >
      {crumbs.map(({ href, label, className, style }, index) => (
        <BreadCrumbsItem key={index} {...itemProps}>
          <BreadCrumbsLink
            {...linkProps}
            href={href}
            className={clsx(linkProps?.className, className)}
            style={{ ...linkProps?.style, ...style }}
          >
            {label}
          </BreadCrumbsLink>
          <BreadCrumbsDivider {...dividerProps}>
            {divider}
          </BreadCrumbsDivider>
        </BreadCrumbsItem>
      ))}
    </BreadCrumbsLayout>
  </BreadCrumbsContext.Provider>
)

export const BreadCrumbs = Object.assign(BreadCrumbsComponent, {
  Layout: BreadCrumbsLayout,
  Item: BreadCrumbsItem,
  Link: BreadCrumbsLink,
  Divider: BreadCrumbsDivider,
  Context: BreadCrumbsContext,
  Provider: BreadCrumbsContext.Provider,
  Consumer: BreadCrumbsContext.Consumer,
})
