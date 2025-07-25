import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import type { PropsWithChildren } from 'react'
import { clsx } from 'clsx'

export type ScrollbarAreaProps = ScrollAreaPrimitive.ScrollAreaProps & PropsWithChildren

export const ScrollArea = ({
                            children,
                            className,
                            ...props
                          }: ScrollbarAreaProps) => {
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      className={clsx(
        'overflow-hidden w-128 h-20 rounded-md',
        className
      )}
      style={{
        // This gets around the React CSSProperties limitations
        ['--scrollbar-size' as never]: '12px',
        ...props.style
      }}
    >
      <ScrollAreaPrimitive.Viewport className="w-full h-full border-inherit">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="horizontal" className="flex-col-0 height-[var(--scrollbar-size)] p-0.5 select-none touch-none bg-black/10">
        <ScrollAreaPrimitive.Thumb className="flex relative rounded-full bg-gray-300 min-h-2"/>
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="flex-row-0 flex width-[var(--scrollbar-size)] p-0.5 select-none touch-none bg-black/10">
        <ScrollAreaPrimitive.Thumb className="flex relative rounded-full bg-gray-300 min-w-2"/>
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner/>
    </ScrollAreaPrimitive.Root>
  )
}

