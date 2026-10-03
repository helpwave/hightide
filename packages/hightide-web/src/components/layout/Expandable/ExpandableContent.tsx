import type { HTMLAttributes } from 'react'
import { forwardRef, useEffect } from 'react'
import { Visibility } from '../Visibility'
import { useExpandableContext } from './ExpandableContext'
import clsx from 'clsx'

export type ExpandableContentProps = HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean,
  isClosingOnClick?: boolean,
}

export const ExpandableContent = forwardRef<HTMLDivElement, ExpandableContentProps>(function ExpandableContent({
  children,
  forceMount = false,
  isClosingOnClick = false,
  id,
  onClick,
  ...props
}, ref) {
  const { isExpanded, ids, setIds, setIsExpanded } = useExpandableContext()

  useEffect(() => {
    if (id) {
      setIds(prevState => ({ ...prevState, content: id }))
    }
  }, [id, setIds])

  return (
    <div
      {...props}
      ref={ref}
      id={ids.content}
      data-expanded={isExpanded ? '' : undefined}
      onClick={event => {
        onClick?.(event)
        if (isClosingOnClick) {
          setIsExpanded(false)
        }
      }}
      className={clsx('expandable-content', props.className)}
    >
      <Visibility isVisible={forceMount || isExpanded}>
        {children}
      </Visibility>
    </div>
  )
})
