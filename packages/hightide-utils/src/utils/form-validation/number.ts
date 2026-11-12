import { boundsValidation, type FormValidationBounds } from './bounds'
import type { FormValidationResult } from './formError'

export const notEmpty = (value: number | undefined | null): FormValidationResult => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return { code: 'validationErrorNotEmpty' }
  }
}

export const range = (value: number | undefined | null, bounds: FormValidationBounds): FormValidationResult => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined
  }

  const [min, max] = bounds
  const result = boundsValidation(value, bounds)

  if (result === 'lower') {
    return { code: 'validationErrorNumberTooSmall', information: { min: min ?? 0 } }
  }
  if (result === 'upper') {
    return { code: 'validationErrorNumberTooLarge', information: { max: max ?? 0 } }
  }
  if (result === 'range') {
    return { code: 'validationErrorOutOfRangeNumber', information: { min: min ?? 0, max: max ?? 0 } }
  }
}
