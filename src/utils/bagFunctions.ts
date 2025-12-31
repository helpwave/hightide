import type { ReactNode } from 'react'

export type BagFunction<B, V = ReactNode> = (bag: B) => V

export type BagFunctionOrValue<B, V> = BagFunction<B, V> | V

export type BagFunctionOrNode<B> = BagFunction<B> | ReactNode

export type PropsWithBagFunction<B, P = unknown> =  P & { children?: BagFunction<B> }

export type PropsWithBagFunctionOrChildren<B, P = unknown> =  P & { children?:  BagFunctionOrNode<B> }

/**
 * Resolves a BagFunction
 *
 * If V is a function this resolver does not work
 * @param bagFunctionOrValue Function or Value
 * @param bag Values for function resolvers
 * @returns The Value or the result of the function
 */
const resolve = <B, V = ReactNode>(bagFunctionOrValue: BagFunctionOrValue<B, V>, bag: B): V => {
  if (typeof bagFunctionOrValue === 'function') {
    return (bagFunctionOrValue as BagFunction<B,V>)(bag)
  }

  return bagFunctionOrValue
}

export const BagFunctionUtil = {
  resolve
}