import { validateEmail } from '@/src/utils/emailValidation'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

export type ValidatorError =
  'notEmpty'
  | 'invalidEmail'
  | 'tooLong'
  | 'tooShort'
  | 'outOfRangeString'
  | 'outOfRangeNumber'
  | 'outOfRangeSelectionItems'
  | 'tooFewSelectionItems'
  | 'tooManySelectionItems'
export type ValidatorResult = ValidatorError | undefined

const notEmpty = (value: unknown): ValidatorResult => {
  if (!value) {
    return 'notEmpty'
  }
}

type BoundsValidatorResult = 'lower' | 'upper' | 'range' | 'none'
const boundsValidator = (length: number | undefined, bounds: [number | undefined, number | undefined]): BoundsValidatorResult => {
  const [min, max] = bounds

  if (min !== undefined && max !== undefined && (length === undefined || length < min || length > max)) {
    return 'range'
  }

  if (min !== undefined && (length === undefined || length < min)) {
    return 'lower'
  }

  if (max !== undefined && length !== undefined && length > max) {
    return 'upper'
  }

  return 'none'
}

const lengthValidator = (value: string | undefined, bounds: [number | undefined, number | undefined]): ValidatorResult => {
  const mapping: Record<BoundsValidatorResult, ValidatorResult> = {
    range: 'outOfRangeString',
    lower: 'tooShort',
    upper: 'tooLong',
    none: undefined
  }
  return mapping[boundsValidator(value?.length, bounds)]
}

const selectionValidator = (value: unknown[], bounds: [number | undefined, number | undefined]): ValidatorResult => {
  const mapping: Record<BoundsValidatorResult, ValidatorResult> = {
    range: 'outOfRangeSelectionItems',
    lower: 'tooFewSelectionItems',
    upper: 'tooManySelectionItems',
    none: undefined
  }
  return mapping[boundsValidator(value?.length, bounds)]
}

const emailValidator = (value: string | undefined) => {
  if (!value || !validateEmail(value)) {
    return 'invalidEmail'
  }
}


export const UseValidators = {
  notEmpty: notEmpty,
  length: lengthValidator,
  email: emailValidator,
  selection: selectionValidator,
}

export const useTranslatedValidators = () => {
  const translation = useHightideTranslation()

  return {
    notEmpty: (value: unknown) => {
      const result = notEmpty(value)
      if (result) {
        return translation(result)
      }
    },
    length: (value: string | undefined, length: [number | undefined, number | undefined]) => {
      const [min, max] = length
      const result = lengthValidator(value, length)
      if (result) {
        return translation(result as 'outOfRangeString' | 'tooShort' | 'tooLong', { min, max })
      }
    },
    email: (value: string) => {
      const result = emailValidator(value)
      if (result) {
        return translation(result as 'invalidEmail')
      }
    },
    selection: (value: unknown[] | undefined, length: [number | undefined, number | undefined]) => {
      const [min, max] = length
      const result = selectionValidator(value, length)
      if (result) {
        return translation(result as
            'outOfRangeSelectionItems' | 'tooFewSelectionItems' | 'tooManySelectionItems',
          { min, max })
      }
    }
  }
}