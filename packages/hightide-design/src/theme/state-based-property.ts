export type ElementState = 'focused' | 'hover' | 'pressed' | 'disabled'

export type StateBasedProperty<P> = {
  base: P,
} & Record<ElementState, Partial<P> | undefined>

const elementStateOrder: ElementState[] = ['focused', 'hover', 'pressed', 'disabled']

export const resolveStateBasedProperty = <P extends object>(
  property: StateBasedProperty<P>,
  states: ReadonlySet<ElementState>
): P => {
  let result: P = { ...property.base }

  for (const key of elementStateOrder) {
    if (states.has(key) && property[key]) {
      result = { ...result, ...property[key] }
    }
  }

  return result
}
