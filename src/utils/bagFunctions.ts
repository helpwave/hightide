import type { ReactNode } from 'react'

export type BagFunction<T> = (bag: T) => ReactNode

export type BagFunctionOrNode<T> = BagFunction<T> | ReactNode

export type PropsWithBagFunction<T, P = unknown> =  P & { children?: BagFunction<T> }

export type PropsWithBagFunctionOrChildren<T, P = unknown> =  P & { children?:  BagFunctionOrNode<T> }

const resolve = <T>(children:  BagFunctionOrNode<T>, bag: T): ReactNode => {
  if (typeof children === 'function') {
    return (children as BagFunction<T>)(bag)
  }

  return children ?? undefined
}

export const BagFunctionUtil = {
  resolve
}