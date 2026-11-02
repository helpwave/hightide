import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { Expandable } from '../Expandable/Expandable'
import { type ExpandableContentProps } from '../Expandable/ExpandableContent'
import { ExpandableContext, useExpandableContext } from '../Expandable/ExpandableContext'
import type { ExpandableRootProps } from '../Expandable/ExpandableRoot'
import { ExpandableSectionContent } from './ExpandableSectionContent'
import { ExpandableSectionHeader } from './ExpandableSectionHeader'
import type { ExpandableSectionHeaderProps } from './ExpandableSectionHeader'
import { ColoringUtils } from '../../interaction'

export type ExpandableSectionProps = Omit<ExpandableRootProps, 'children'> & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> & {
  trigger: ReactNode,
  triggerProps?: Omit<ExpandableSectionHeaderProps, 'children'>,
  contentProps?: Omit<ExpandableContentProps, 'children'>,
  contentExpandedClassName?: string,
  isUsingDefaultIcon?: boolean,
  children?: ReactNode,
}

const ExpandableSectionFrame = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ExpandableSectionFrame({
  className,
  children,
  ...props
}, ref) {
  const { isExpanded, disabled } = useExpandableContext()

  return (
    <div
      data-expanded={isExpanded ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      {...ColoringUtils.build({ color: 'surface' })}
      {...props}
      ref={ref}
      className={clsx('expandable-section-root', className)}
    >
      {children}
    </div>
  )
})

export const ExpandableSectionComponent = forwardRef<HTMLDivElement, ExpandableSectionProps>(function ExpandableSection({
  children,
  trigger,
  triggerProps,
  contentProps,
  contentExpandedClassName,
  isUsingDefaultIcon = true,
  isExpanded,
  onExpandedChange,
  isInitialExpanded,
  disabled,
  id,
  className,
  ...props
}, ref) {
  return (
    <Expandable.Root
      id={id}
      isExpanded={isExpanded}
      onExpandedChange={onExpandedChange}
      isInitialExpanded={isInitialExpanded}
      disabled={disabled}
    >
      <ExpandableSectionFrame ref={ref} className={className} {...props}>
        <Expandable.Trigger>
          {({ props: openerProps }) => (
            <ExpandableSectionHeader
              {...openerProps}
              {...triggerProps}
              isUsingDefaultIcon={isUsingDefaultIcon}
              className={triggerProps?.className}
              onClick={event => {
                openerProps.onClick()
                triggerProps?.onClick?.(event)
              }}
            >
              {trigger}
            </ExpandableSectionHeader>
          )}
        </Expandable.Trigger>
        <ExpandableSectionContent
          {...contentProps}
          contentExpandedClassName={contentExpandedClassName}
        >
          {children}
        </ExpandableSectionContent>
      </ExpandableSectionFrame>
    </Expandable.Root>
  )
})

export const ExpandableSection = Object.assign(ExpandableSectionComponent, {
  SectionFrame: ExpandableSectionFrame,
  Header: ExpandableSectionHeader,
  Content: ExpandableSectionContent,
  Context: ExpandableContext,
  Consumer: ExpandableContext.Consumer,
})
