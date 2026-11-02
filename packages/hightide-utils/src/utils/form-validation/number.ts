import { boundsValidation, type FormValidationBounds } from './bounds'
import type { FormValidationResult } from './FormValidationErrorType'

export const notEmpty = (value: number | undefined | null): FormValidationResult => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return 'notEmpty'
  }
}

export const range = (value: number | undefined | null, bounds: FormValidationBounds): FormValidationResult => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined
  }

  const result = boundsValidation(value, bounds)
  if (result === 'none') {
    return undefined
  }

  return 'outOfRangeNumber'
}
