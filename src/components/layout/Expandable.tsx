import type { Dispatch, HTMLAttributes, PropsWithChildren, ReactNode, SetStateAction } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext, forwardRef, useCallback, useContext, useId, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { Visibility } from './Visibility'

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
// Shared Components
//

export type ExpansionIconProps = HTMLAttributes<HTMLDivElement> & {
  isExpanded?: boolean,
}

export const ExpansionIcon = ({
                                children,
                                isExpanded: isExpandedOverwrite,
                                ...props
                              }: ExpansionIconProps) => {
  const { isExpanded: contextIsExpanded, disabled } = useExpandableContext()
  const isExpanded = useMemo(() => isExpandedOverwrite ?? contextIsExpanded, [isExpandedOverwrite, contextIsExpanded])

  return (
    <div
      {...props}
      data-name="expandable-icon"
      data-expanded={isExpanded ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      {children ? (
        children
      ) : (
        <ChevronDown
          aria-hidden={true}
          className="size-4"
        />
      )}
    </div>
  )
}

//
// ExpandableRoot
//

export type ExpandableRootProps = HTMLAttributes<HTMLDivElement> & {
  isExpanded?: boolean,
  onExpandedChange?: (isExpanded: boolean) => void,
  disabled?: boolean,
  allowContainerToggle?: boolean,
}

export const ExpandableRoot = forwardRef<HTMLDivElement, ExpandableRootProps>(function ExpandableRoot({
                                                                                                        children,
                                                                                                        id: providedId,
                                                                                                        isExpanded: controlledExpanded,
                                                                                                        onExpandedChange,
                                                                                                        disabled = false,
                                                                                                        allowContainerToggle = false,
                                                                                                        ...props
                                                                                                      }, ref) {
  const generatedId = useId()
  const [ids, setIds] = useState<ExpandableContextIdsState>({
    root: providedId ?? `expandable-${generatedId}-root`,
    header: `expandable-${generatedId}-header`,
    content: `expandable-${generatedId}-content`
  })
  const [isExpanded, setIsExpanded] = useOverwritableState(controlledExpanded, onExpandedChange)

  const toggle = useCallback(() => {
    if (!disabled) {
      setIsExpanded(!isExpanded)
    }
  }, [disabled, isExpanded, setIsExpanded])

  const contextValue = useMemo(() => ({
    isExpanded: !!isExpanded,
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

        onClick={(event) => {
          props.onClick?.(event)
          if(allowContainerToggle) {
            toggle()
          }
        }}

        data-name="expandable-root"
        data-expanded={isExpanded ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-containertoggleable={allowContainerToggle ? '' : undefined}
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
}

export const ExpandableHeader = forwardRef<HTMLDivElement, ExpandableHeaderProps>(function ExpandableHeader({
                                                                                                                 children,
                                                                                                                 className,
                                                                                                                 isUsingDefaultIcon = true,
                                                                                                                 ...props
                                                                                                               }, ref) {
  const { isExpanded, toggle, ids, setIds, disabled } = useExpandableContext()
  useEffect(() => {
    if(props.id) {
      setIds(prevState => ({ ...prevState, header: props.id }))
    }
  }, [props.id, setIds])

  return (
    <div
      {...props}
      ref={ref}
      id={ids.header}

      onClick={event => {
        event.stopPropagation()
        props.onClick?.(event)
        toggle()
      }}

      data-name="expandable-header"
      data-expanded={isExpanded ? '' : undefined}
      data-disabled={disabled ? '' : undefined}

      aria-expanded={isExpanded}
      aria-controls={ids.content}
      aria-disabled={disabled || undefined}
    >
      {children}
      <Visibility isVisible={isUsingDefaultIcon}>
        <ExpansionIcon/>
      </Visibility>
    </div>
  )
})

//
// ExpandableContent
//

export type ExpandableContentProps = HTMLAttributes<HTMLDivElement>

export const ExpandableContent = forwardRef<HTMLDivElement, ExpandableContentProps>(function ExpandableContent({
                                                                                                                 children,
                                                                                                                 ...props
                                                                                                               }, ref) {
  const { isExpanded, ids, setIds } = useExpandableContext()
  useEffect(() => {
    if(props.id) {
      setIds(prevState => ({ ...prevState, content: props.id }))
    }
  }, [props.id, setIds])

  return (
    <div
      {...props}
      ref={ref}
      id={ids.content}
      
      data-name="expandable-content"
      data-expanded={isExpanded ? '' : undefined}
    >
      {children}
    </div>
  )
})


//
// Composite / Legacy Components
//

type IconBuilder = (expanded: boolean) => ReactNode

export type ExpandableProps = PropsWithChildren<{
  id?: string,
  label: ReactNode,
  icon?: IconBuilder,
  isExpanded?: boolean,
  onChange?: (isExpanded: boolean) => void,
  clickOnlyOnHeader?: boolean,
  disabled?: boolean,
  className?: string,
  headerClassName?: string,
  contentClassName?: string,
  contentExpandedClassName?: string,
}>

export const Expandable = forwardRef<HTMLDivElement, ExpandableProps>(function Expandable({
                                                                                            children,
                                                                                            id,
                                                                                            label,
                                                                                            icon,
                                                                                            isExpanded,
                                                                                            onChange,
                                                                                            clickOnlyOnHeader = true,
                                                                                            disabled = false,
                                                                                            className,
                                                                                            headerClassName,
                                                                                            contentClassName,
                                                                                            contentExpandedClassName,
                                                                                          }, ref) {

  const defaultIcon = useCallback((expanded: boolean) => <ExpansionIcon isExpanded={expanded}/>, [])
  const iconBuilder = icon ?? defaultIcon

  return (
    <ExpandableRoot
      ref={ref}
      id={id}
      isExpanded={isExpanded}
      onExpandedChange={onChange}
      disabled={disabled}
      allowContainerToggle={!clickOnlyOnHeader}
      className={className}
    >
      <ExpandableHeader className={headerClassName}>
        {label}
        {/* We use a consumer here because the iconBuilder needs the state which is inside the provider */}
        <ExpandableContext.Consumer>
          {ctx => iconBuilder(ctx?.isExpanded ?? false)}
        </ExpandableContext.Consumer>
      </ExpandableHeader>
      <ExpandableContext.Consumer>
        {ctx => (
          <ExpandableContent
            className={clsx(contentClassName, {[contentExpandedClassName ?? ""]: !!ctx?.isExpanded})}
          >
            {children}
          </ExpandableContent>
        )}
      </ExpandableContext.Consumer>
      
    </ExpandableRoot>
  )
})

export const ExpandableUncontrolled = forwardRef<HTMLDivElement, ExpandableProps>(function ExpandableUncontrolled({
                                                                                                                    isExpanded,
                                                                                                                    onChange,
                                                                                                                    ...props
                                                                                                                  }, ref) {
  const [usedIsExpanded, setUsedIsExpanded] = useOverwritableState(isExpanded, onChange)

  return (
    <Expandable
      {...props}
      ref={ref}
      isExpanded={usedIsExpanded}
      onChange={setUsedIsExpanded}
    />
  )
})