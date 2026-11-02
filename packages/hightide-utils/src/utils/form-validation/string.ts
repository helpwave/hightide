import { boundsValidation, type FormValidationBounds } from './bounds'
import type { FormValidationResult } from './FormValidationErrorType'

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const notEmpty = (value: string | undefined): FormValidationResult => {
  if (!value) {
    return 'notEmpty'
  }
}

export const email = (value: string | undefined): FormValidationResult => {
  if (!value || !emailPattern.test(value)) {
    return 'invalidEmail'
  }
}

export const length = (value: string | undefined, bounds: FormValidationBounds): FormValidationResult => {
  const mapping: Record<ReturnType<typeof boundsValidation>, FormValidationResult> = {
    range: 'outOfRangeString',
    lower: 'tooShort',
    upper: 'tooLong',
    none: undefined,
  }
  return mapping[boundsValidation(value?.length, bounds)]
}
