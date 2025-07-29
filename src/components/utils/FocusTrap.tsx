import type { PropsWithChildren, Ref } from 'react'
import { useFocusGuards } from '@/src/hooks/focus/useFocusGuards'

export type FocusTrapProps = PropsWithChildren<{
  initialFocus?: Ref<HTMLElement>,
}>

export const FocusTrap = ({
                            children,
                            initialFocus
                          }: FocusTrapProps) => {
  useFocusGuards()

}