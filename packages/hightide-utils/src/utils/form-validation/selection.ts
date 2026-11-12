import { boundsValidation, type FormValidationBounds } from './bounds'
import type { FormValidationResult } from './formError'

export const notEmpty = (value: readonly unknown[] | undefined): FormValidationResult => {
  if (!value || value.length === 0) {
    return { code: 'validationErrorNotEmpty' }
  }
}

export const bounds = (value: readonly unknown[] | undefined, limits: FormValidationBounds): FormValidationResult => {
  const [min, max] = limits
  const result = boundsValidation(value?.length, limits)

  if (result === 'lower') {
    return { code: 'validationErrorTooFewSelectionItems', information: { min: min ?? 0 } }
  }
  if (result === 'upper') {
    return { code: 'validationErrorTooManySelectionItems', information: { max: max ?? 0 } }
  }
  if (result === 'range') {
    return { code: 'validationErrorOutOfRangeSelectionItems', information: { min: min ?? 0, max: max ?? 0 } }
  }
}
