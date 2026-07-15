import type { ForwardedRef } from 'react'

function assignForwardRef<T>(element: T | null, ref?: ForwardedRef<T>) {
  if(!ref) return
  if(typeof ref === 'function') {
    ref(element)
  } else {
    ref.current = element
  }
}

function assingRefsBuilder<T>(refs: ForwardedRef<T>[]) : (el: T | null) => void {
  return (element) => {
    refs.forEach(ref => {
      assignForwardRef(element, ref)
    })
  }
}

export const ReactUtils = {
  assignForwardRef,
  assingRefsBuilder
}