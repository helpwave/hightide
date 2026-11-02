import type { ReactNode } from 'react'
import { forwardRef, useRef } from 'react'
import clsx from 'clsx'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

import { useTransitionState } from '../../../hooks/useTransitionState'
import { ExpandableContent } from '../Expandable/ExpandableContent'
import type { ExpandableContentProps } from '../Expandable/ExpandableContent'
import { useExpandableContext } from '../Expandable/ExpandableContext'

export type ExpandableSectionContentProps = Omit<ExpandableContentProps, 'children'> & {
  contentExpandedClassName?: string,
  children?: ReactNode,
}

export const ExpandableSectionContent = forwardRef<HTMLDivElement, ExpandableSectionContentProps>(function ExpandableSectionContent({
  children,
  className,
  contentExpandedClassName,
  ...props
}, forwardedRef) {
  const { isExpanded } = useExpandableContext()
  const ref = useRef<HTMLDivElement | null>(null)
  const { transitionState } = useTransitionState({ isOpen: isExpanded, ref })

  return (
    <ExpandableContent
      {...props}
      ref={ReactUtils.assingRefsBuilder([ref, forwardedRef])}
      data-state={transitionState}
      className={clsx(
        'expandable-section-content',
        className,
        isExpanded && contentExpandedClassName
      )}
    >
      {children}
    </ExpandableContent>
  )
})
