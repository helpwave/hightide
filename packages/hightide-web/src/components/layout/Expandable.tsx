import type { Dispatch, HTMLAttributes, ReactNode, SetStateAction } from 'react'
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { createContext, forwardRef, useCallback, useContext, useId, useMemo } from 'react'
import clsx from 'clsx'
import { Visibility } from './Visibility'
import { ExpansionIcon } from '../display-and-visualization/ExpansionIcon'
import { useTransitionState } from '../../hooks/useTransitionState'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

//
// Context
//
type ExpandableContextIdsState = {
  root: string,
  header: string,
  content: string,
}

type ExpandableContextState = {
  ids: ExpandableContextIdsState,
  setIds: Dispatch<SetStateAction<ExpandableContextIdsState>>,
  disabled: boolean,
  isExpanded: boolean,
  toggle: () => void,
  setIsExpanded: Dispatch<SetStateAction<boolean>>,
}

const ExpandableContext = createContext<ExpandableContextState | null>(null)

function useExpandableContext() {
  const context = useContext(ExpandableContext)
  if (!context) {
    throw new Error('Expandable components must be used within an ExpandableRoot')
  }
  return context
}

//
// ExpandableRoot
//

export type ExpandableRootProps = HTMLAttributes<HTMLDivElement> & {
  isExpanded?: boolean,
  onExpandedChange?: (isExpanded: boolean) => void,
  isInitialExpanded?: boolean,
  disabled?: boolean,
}

export const ExpandableRoot = forwardRef<HTMLDivElement, ExpandableRootProps>(function ExpandableRoot({
  children,
  id: providedId,
  isExpanded: controlledExpanded,
  onExpandedChange,
  isInitialExpanded = false,
  disabled = false,
  ...props
}, ref) {
  const generatedId = useId()
  const [ids, setIds] = useState<ExpandableContextIdsState>({
    root: providedId ?? `expandable-${generatedId}-root`,
    header: `expandable-${generatedId}-header`,
    content: `expandable-${generatedId}-content`
  })
  const [isExpanded, setIsExpanded] = useControlledState({
    value: controlledExpanded,
    onValueChange: onExpandedChange,
    defaultValue: isInitialExpanded,
  })

  const toggle = useCallback(() => {
    if (!disabled) {
      setIsExpanded(!isExpanded)
    }
  }, [disabled, isExpanded, setIsExpanded])

  const contextValue = useMemo(() => ({
    isExpanded,
    toggle,
    setIsExpanded,
    ids,
    setIds,
    disabled
  }), [isExpanded, toggle, setIsExpanded, ids, disabled])

  return (
    <ExpandableContext.Provider value={contextValue}>
      <div
        {...props}
        ref={ref}
        id={ids.root}
        data-expanded={isExpanded ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={clsx('expandable-root', props.className)}
      >
        {children}
      </div>
    </ExpandableContext.Provider>
  )
})

//
// ExpandableHeader
//

export type ExpandableHeaderProps = HTMLAttributes<HTMLDivElement> & {
  isUsingDefaultIcon?: boolean,
  triggerProps?: HTMLAttributes<HTMLButtonElement>,
}

export const ExpandableHeader = forwardRef<HTMLDivElement, ExpandableHeaderProps>(function ExpandableHeader({
  children,
  isUsingDefaultIcon = true,
  triggerProps,
  ...props
}, ref) {
  const { isExpanded, toggle, ids, setIds, disabled } = useExpandableContext()
  useEffect(() => {
    const id = props.id
    if (id) {
      setIds(prevState => ({ ...prevState, header: id }))
    }
  }, [props.id, setIds])

  return (
    <div
      ref={ref}
      {...props}
      id={ids.header}
      className={clsx('expandable-header-container', props.className)}
    >
      <button
        {...triggerProps}
        onClick={event => {
          triggerProps?.onClick?.(event)
          toggle()
        }}
        data-expanded={isExpanded ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        aria-expanded={isExpanded}
        aria-controls={ids.content}
        aria-disabled={disabled || undefined}
        className={clsx('expandable-header', triggerProps?.className)}
      >
        {children}
      </button>
      <Visibility isVisible={isUsingDefaultIcon}>
        <ExpansionIcon isExpanded={isExpanded} disabled={disabled} className="expandable-header-icon" />
      </Visibility>
    </div>
  )
})

//
// ExpandableContent
//

export type ExpandableContentProps = HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean,
  isClosingOnClick?: boolean,
}

export const ExpandableContent = forwardRef<HTMLDivElement, ExpandableContentProps>(function ExpandableContent({
  children,
  forceMount = false,
  isClosingOnClick = false,
  ...props
}, forwardedRef) {
  const { isExpanded, ids, setIds, setIsExpanded } = useExpandableContext()

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const id = props.id
    if (id) {
      setIds(prevState => ({ ...prevState, content: id }))
    }
  }, [props.id, setIds])

  const { transitionState } = useTransitionState({ isOpen: isExpanded, ref })

  return (
    <div
      {...props}
      ref={ReactUtils.assingRefsBuilder([ref, forwardedRef])}
      id={ids.content}
      data-expanded={isExpanded ? '' : undefined}
      data-state={transitionState}
      className={clsx('expandable-content', props.className)}
      onClick={event => {
        props.onClick?.(event)
        if (isClosingOnClick) {
          setIsExpanded(false)
        }
      }}
    >
      <Visibility isVisible={forceMount || isExpanded}>
        {children}
      </Visibility>
    </div>
  )
})


//
// Composite
//
export interface ExpandableProps extends ExpandableRootProps {
  trigger: ReactNode,
  triggerProps?: Omit<ExpandableHeaderProps, 'children'>,
  contentProps?: Omit<ExpandableContentProps, 'children'>,
  contentExpandedClassName?: string,
}

export const Expandable = forwardRef<HTMLDivElement, ExpandableProps>(function Expandable({
  children,
  trigger,
  triggerProps,
  contentProps,
  contentExpandedClassName,
  ...props
}, ref) {
  return (
    <ExpandableRoot ref={ref} {...props}>
      <ExpandableHeader {...triggerProps}>
        {trigger}
      </ExpandableHeader>
      <ExpandableContext.Consumer>
        {ctx => (
          <ExpandableContent
            className={clsx(contentProps?.className, { [contentExpandedClassName ?? '']: !!ctx?.isExpanded })}
          >
            {children}
          </ExpandableContent>
        )}
      </ExpandableContext.Consumer>
    </ExpandableRoot>
  )
})