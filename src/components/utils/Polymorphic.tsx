import type { SlotProps } from '@radix-ui/react-slot'
import { Slot } from '@radix-ui/react-slot'
import type { RefObject , Ref } from 'react'
import { forwardRef, type ElementType } from 'react'

export interface PolymorphicSlotProps extends SlotProps {
  asChild?: boolean,
  defaultComponent?: ElementType,
}

export const PolymorphicSlot = forwardRef(function PolymorphicSlot({
  children,
  asChild,
  defaultComponent = 'div',
  ...props
}: PolymorphicSlotProps, ref: RefObject<HTMLElement>) {
  const Component = asChild ? Slot : defaultComponent
  return (
    <Component {...props} ref={ref as unknown as Ref<HTMLElement>}>
      {children}
    </Component>
  )
})