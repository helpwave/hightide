import type { EnumUtilsType } from './enum'

const loadingStateValues = ['idle', 'loading', 'blocked', 'processing'] as const
export type LoadingState = (typeof loadingStateValues)[number]
const allowedLoadingStateValues: ReadonlySet<string> = new Set(loadingStateValues)
function isLoadingStateValue(value: unknown): value is LoadingState {
  if (typeof value !== 'string') return false
  return allowedLoadingStateValues.has(value)
}
export const LoadingStateUtils: EnumUtilsType<LoadingState> = {
  values: loadingStateValues,
  set: allowedLoadingStateValues,
  isValue: isLoadingStateValue,
}

const interactiveStateValues = ['hover', 'pressed', 'focus', 'focus-visible', 'disabled'] as const
export type InteractiveState = (typeof interactiveStateValues)[number]
const allowedInteractiveStateValues: ReadonlySet<string> = new Set(interactiveStateValues)
function isInteractiveStateValue(value: unknown): value is InteractiveState {
  if (typeof value !== 'string') return false
  return allowedInteractiveStateValues.has(value)
}
export const InteractiveStateUtils: EnumUtilsType<InteractiveState> = {
  values: interactiveStateValues,
  set: allowedInteractiveStateValues,
  isValue: isInteractiveStateValue,
}

const dataInputStateValues = [
  'readonly',
  'invalid',
  'hover',
  'pressed',
  'focus',
  'focus-visible',
  'disabled',
] as const
export type DataInputState = (typeof dataInputStateValues)[number]
const allowedDataInputStateValues: ReadonlySet<string> = new Set(dataInputStateValues)
function isDataInputStateValue(value: unknown): value is DataInputState {
  if (typeof value !== 'string') return false
  return allowedDataInputStateValues.has(value)
}
export const DataInputStateUtils: EnumUtilsType<DataInputState> = {
  values: dataInputStateValues,
  set: allowedDataInputStateValues,
  isValue: isDataInputStateValue,
}
