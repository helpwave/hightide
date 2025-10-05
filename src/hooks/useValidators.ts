import { validateEmail } from '@/src/utils/emailValidation'
import type { Translation } from '@/src/localization/useTranslation'
import { useTranslation } from '@/src/localization/useTranslation'

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



type ValidatorTranslationType = Record<ValidatorError, string>

export const defaultValidatorTranslation: Translation<ValidatorTranslationType> = {
  en: {
    notEmpty: 'The field cannot be empty.',
    invalidEmail: 'The email is not valid.',
    tooShort: 'The value requires at least {{min}} characters.',
    tooLong: 'The value requires less than {{max}} characters.',
    outOfRangeString: 'The value needs to have between {{min}} and {{max}} characters.',
    outOfRangeNumber: 'The value must be between {{min}} and {{max}}.',
    outOfRangeSelectionItems: 'Between {{min}} and {{max}} items must be selected.',
    tooFewSelectionItems: 'Select at least {{min}} items.',
    tooManySelectionItems: 'Select at most {{max}} items.',
  },
  de: {
    notEmpty: 'Das Feld darf nicht leer sein.',
    invalidEmail: 'Die E-Mail ist ungültig.',
    tooShort: 'Der Wert muss mindestens {{min}} Zeichen enthalten.',
    tooLong: 'Der Wert darf höchstens {{max}} Zeichen enthalten.',
    outOfRangeString: 'Der Wert muss zwischen {{min}} und {{max}} Zeichen lang sein.',
    outOfRangeNumber: 'Der Wert muss zwischen {{min}} und {{max}} liegen.',
    outOfRangeSelectionItems: 'Es müssen zwischen {{min}} und {{max}} Elemente ausgewählt werden.',
    tooFewSelectionItems: 'Es müssen mindestens {{min}} Elemente ausgewählt werden.',
    tooManySelectionItems: 'Es müssen maximal {{max}} Elemente ausgewählt werden.',
  },
}

export const UseValidators = {
  notEmpty: notEmpty,
  length: lengthValidator,
  email: emailValidator,
  selection: selectionValidator,
}

export const useTranslatedValidators = () => {
  const translation = useTranslation([defaultValidatorTranslation])

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
        return translation(result, { replacements: { min: min.toString(), max: max.toString() } })
      }
    },
    email: (value: string) => {
      const result = emailValidator(value)
      if (result) {
        return translation(result)
      }
    },
    selection: (value: unknown[]| undefined, length: [number | undefined, number | undefined]) => {
      const [min, max] = length
      const result = selectionValidator(value, length)
      if (result) {
        return translation(result, { replacements: { min: min.toString(), max: max.toString() } })
      }
    }
  }
}