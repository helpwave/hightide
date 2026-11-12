import { boundsValidation, type FormValidationBounds } from './bounds'
import type { FormValidationResult } from './formError'

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const notEmpty = (value: string | undefined): FormValidationResult => {
  if (!value) {
    return { code: 'validationErrorNotEmpty' }
  }
}

export const email = (value: string | undefined): FormValidationResult => {
  if (!value || !emailPattern.test(value)) {
    return { code: 'validationErrorInvalidEmail' }
  }
}

export const length = (value: string | undefined, bounds: FormValidationBounds): FormValidationResult => {
  const [min, max] = bounds
  const result = boundsValidation(value?.length, bounds)

  if (result === 'lower') {
    return { code: 'validationErrorTooShort', information: { min: min ?? 0 } }
  }
  if (result === 'upper') {
    return { code: 'validationErrorTooLong', information: { max: max ?? 0 } }
  }
  if (result === 'range') {
    return { code: 'validationErrorOutOfRangeString', information: { min: min ?? 0, max: max ?? 0 } }
  }
}
