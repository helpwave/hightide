import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import type { PropsWithChildren } from 'react'
import { clsx } from 'clsx'

export type ScrollBarSize = 'sm' | 'md'
export type ScrollBarType = 'auto' | 'always' | 'scroll' | 'hover'
export type ScrollBarAxis = 'horizontal' | 'vertical' | 'both' | 'none'

export type ScrollAreaProps = Omit<ScrollAreaPrimitive.ScrollAreaProps, 'type'> & PropsWithChildren & {
  scrollbarSize?: ScrollBarSize,
  scrollbarType?: ScrollBarType,
  scrollbarAxis?: ScrollBarAxis,
}


export const ScrollArea = ({
                             children,
                             scrollbarSize = 'md',
                             scrollbarType = 'auto',
                             scrollbarAxis = 'both',
                             className,
                             ...props
                           }: ScrollAreaProps) => {
  const scrollbarStyle = {
    sm: { '--scrollbar-size': 'calc(4px + var(--spacing))' },
    md: { '--scrollbar-size': 'calc(6px + var(--spacing))' },
  }[scrollbarSize]

  const hasHorizontalScrollBar = scrollbarAxis === 'horizontal' || scrollbarAxis === 'both'
  const hasVerticalScrollBar = scrollbarAxis === 'vertical' || scrollbarAxis === 'both'

  return (
    <ScrollAreaPrimitive.Root
      {...props}
      className={clsx(
        'overflow-hidden',
        className
      )}
      style={{
        ...scrollbarStyle,
        ...props.style
      }}
      type={scrollbarType}
    >
      {hasHorizontalScrollBar && (
        <ScrollAreaPrimitive.Scrollbar
          orientation="horizontal"
          className={clsx(
            'peer/horizontal group/scrollbar flex-col-0 rounded-full select-none touch-none bg-scrollbar-track/50 hover:bg-scrollbar-track',
            {
              'h-[var(--scrollbar-size)]': scrollbarType === 'always',
              'data-[state=visible]:h-[var(--scrollbar-size)]': scrollbarType !== 'always',
            }
          )}
        >
          <ScrollAreaPrimitive.Thumb
            className={clsx(
              'flex relative rounded-full bg-scrollbar-thumb group-hover/scrollbar:bg-primary',
              {
                'min-h-[var(--scrollbar-size)]': scrollbarType === 'always',
                'data-[state=visible]:min-h-[var(--scrollbar-size)]': scrollbarType !== 'always',
              }
            )}
          />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      {hasVerticalScrollBar && (
        <ScrollAreaPrimitive.Scrollbar
          orientation="vertical"
          className={clsx(
            'peer/vertical group/scrollbar flex-col-0 rounded-full select-none touch-none bg-scrollbar-track/50 hover:bg-scrollbar-track',
            {
              'w-[var(--scrollbar-size)]': scrollbarType === 'always',
              'data-[state=visible]:w-[var(--scrollbar-size)]': scrollbarType !== 'always',
            }
          )}>
          <ScrollAreaPrimitive.Thumb
            className={clsx(
              'flex relative rounded-full bg-scrollbar-thumb group-hover/scrollbar:bg-primary',
              {
                'min-w-[var(--scrollbar-size)]': scrollbarType === 'always',
                'data-[state=visible]:min-w-[var(--scrollbar-size)]': scrollbarType !== 'always',
              }
            )}
          />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      <ScrollAreaPrimitive.Viewport
        className={clsx(
          'border-inherit',
          {
            'w-[calc(100%_-_var(--scrollbar-size))] h-[calc(100%_-_var(--scrollbar-size))]': scrollbarType === 'always',
            'w-full h-full': scrollbarType === 'scroll' || scrollbarType === 'hover' || scrollbarType === 'auto',
            'peer-[&:where([data-state=visible])]/horizontal:h-[calc(100%_-_var(--scrollbar-size))] peer-[&:where([data-state=visible])]/vertical:w-[calc(100%_-_var(--scrollbar-size))]': scrollbarType === 'auto',
          }
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Corner
        className={clsx(
          'bg-scrollbar-track rounded-full'
        )}
      />
    </ScrollAreaPrimitive.Root>
  )
}

