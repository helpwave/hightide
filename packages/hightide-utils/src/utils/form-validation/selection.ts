import { boundsValidation, type FormValidationBounds } from './bounds'
import type { FormValidationResult } from './FormValidationErrorType'

export const notEmpty = (value: readonly unknown[] | undefined): FormValidationResult => {
  if (!value || value.length === 0) {
    return 'notEmpty'
  }
}

export const bounds = (value: readonly unknown[] | undefined, limits: FormValidationBounds): FormValidationResult => {
  const mapping: Record<ReturnType<typeof boundsValidation>, FormValidationResult> = {
    range: 'outOfRangeSelectionItems',
    lower: 'tooFewSelectionItems',
    upper: 'tooManySelectionItems',
    none: undefined,
  }
  return mapping[boundsValidation(value?.length, limits)]
}
