import type { PressableVariant } from '../semantic-token-resolvers/types'

export const pressableStateValues = [
  'disabled',
  'focused',
  'focusVisible',
  'hovered',
  'pressed',
] as const

export type PressableStateValue = typeof pressableStateValues[number]

export type PressableState = ReadonlySet<PressableStateValue>

export const pressableStateValueSet: ReadonlySet<PressableStateValue> = new Set(pressableStateValues)

export const isPressableStateValue = (value: string): value is PressableStateValue => (
  pressableStateValueSet.has(value as PressableStateValue)
)

export const toPressableState = (state: ReadonlySet<string>): PressableState => {
  const active = new Set<PressableStateValue>()
  for (const value of state) {
    if (isPressableStateValue(value)) {
      active.add(value)
    }
  }
  return active
}

export const pressableVariants = [
  'elevated',
  'filled',
  'tonal',
  'outlined',
  'foreground',
] as const satisfies readonly PressableVariant[]
