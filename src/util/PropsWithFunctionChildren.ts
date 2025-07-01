import type { ReactNode } from 'react'

export type BagFunction<T> = (bag: T) => ReactNode

export type PropsWithBagFunction<T, P = unknown> =  P & { children?: BagFunction<T> }

export type PropsWithBagFunctionOrChildren<T, P = unknown> =  P & { children?: BagFunction<T> | ReactNode }

const resolve = <T>(children: BagFunction<T> | ReactNode, bag: T): ReactNode => {
  if (typeof children === 'function') {
    return (children as BagFunction<T>)(bag)
  }

  return children ?? undefined
}

export const BagFunctionUtil = {
  resolve
}