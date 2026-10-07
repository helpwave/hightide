import type { HightideTranslationEntries } from '../../i18n/translations'
import type {
  FormValidationErrorType,
  NumberFormValidationErrorType,
  SelectionFormValidationErrorType,
  StringFormValidationErrorType
} from './FormValidationErrorType'

type TranslationParameters<K extends keyof HightideTranslationEntries> =
  HightideTranslationEntries[K] extends (values: infer Values) => string
    ? Values
    : undefined

type FormValidationTranslationKey<T extends FormValidationErrorType> =
  `validationError${Capitalize<T>}` extends keyof HightideTranslationEntries
    ? `validationError${Capitalize<T>}`
    : never

export type FormValidationTranslationParameters<T extends FormValidationErrorType> =
  TranslationParameters<FormValidationTranslationKey<T>>

type OptionalTranslationParameters<T extends FormValidationErrorType> =
  FormValidationTranslationParameters<T> extends undefined
    ? undefined
    : Partial<FormValidationTranslationParameters<T>>

export type FormValidationTranslationInput<T extends FormValidationErrorType> = {
  type: T,
  parameter?: OptionalTranslationParameters<T>,
}

export type FormValidationTranslation<T extends FormValidationErrorType> = {
  key: FormValidationTranslationKey<T>,
  parameter: FormValidationTranslationParameters<T>,
}

const formValidationTranslationKeys = {
  notEmpty: 'validationErrorNotEmpty',
  invalidEmail: 'validationErrorInvalidEmail',
  tooLong: 'validationErrorTooLong',
  tooShort: 'validationErrorTooShort',
  outOfRangeString: 'validationErrorOutOfRangeString',
  outOfRangeNumber: 'validationErrorOutOfRangeNumber',
  outOfRangeSelectionItems: 'validationErrorOutOfRangeSelectionItems',
  tooFewSelectionItems: 'validationErrorTooFewSelectionItems',
  tooManySelectionItems: 'validationErrorTooManySelectionItems',
} as const satisfies { [T in FormValidationErrorType]: FormValidationTranslationKey<T> }

const numberParameterDefaults = {
  min: 0,
  max: 0,
}

const fillNumberParameter = <T extends { min?: number, max?: number }>(
  required: T,
  provided: Partial<T> | undefined
): T => {
  const filled = { ...required }

  if (!provided) {
    return filled
  }

  for (const key of Object.keys(required) as (keyof T)[]) {
    const value = provided[key]
    if (value !== undefined) {
      filled[key] = value
    }
  }

  return filled
}

const toTranslation = <T extends FormValidationErrorType>(
  type: T,
  parameter: FormValidationTranslationParameters<T>
): FormValidationTranslation<T> => ({
  key: formValidationTranslationKeys[type],
  parameter,
}) as unknown as FormValidationTranslation<T>

const mapWithNumbers = <T extends FormValidationErrorType>(
  type: T,
  provided: { min?: number, max?: number } | undefined,
  required: { min?: number, max?: number }
): FormValidationTranslation<T> => {
  return toTranslation(type, fillNumberParameter(required, provided) as FormValidationTranslationParameters<T>)
}

export const mapStringTranslation = <T extends StringFormValidationErrorType>(
  error: FormValidationTranslationInput<T>
): FormValidationTranslation<T> => {
  const provided = error.parameter as { min?: number, max?: number } | undefined

  switch (error.type) {
  case 'notEmpty':
  case 'invalidEmail':
    return toTranslation(error.type, undefined as FormValidationTranslationParameters<T>)
  case 'tooShort':
    return mapWithNumbers(error.type, provided, { min: numberParameterDefaults.min })
  case 'tooLong':
    return mapWithNumbers(error.type, provided, { max: numberParameterDefaults.max })
  case 'outOfRangeString':
    return mapWithNumbers(error.type, provided, numberParameterDefaults)
  default: {
    const unsupported: never = error.type
    throw new Error(`Unsupported string validation error type: ${unsupported}`)
  }
  }
}

export const mapNumberTranslation = <T extends NumberFormValidationErrorType>(
  error: FormValidationTranslationInput<T>
): FormValidationTranslation<T> => {
  const provided = error.parameter as { min?: number, max?: number } | undefined

  switch (error.type) {
  case 'notEmpty':
    return toTranslation(error.type, undefined as FormValidationTranslationParameters<T>)
  case 'outOfRangeNumber':
    return mapWithNumbers(error.type, provided, numberParameterDefaults)
  default: {
    const unsupported: never = error.type
    throw new Error(`Unsupported number validation error type: ${unsupported}`)
  }
  }
}

export const mapSelectionTranslation = <T extends SelectionFormValidationErrorType>(
  error: FormValidationTranslationInput<T>
): FormValidationTranslation<T> => {
  const provided = error.parameter as { min?: number, max?: number } | undefined

  switch (error.type) {
  case 'notEmpty':
    return toTranslation(error.type, undefined as FormValidationTranslationParameters<T>)
  case 'tooFewSelectionItems':
    return mapWithNumbers(error.type, provided, { min: numberParameterDefaults.min })
  case 'tooManySelectionItems':
    return mapWithNumbers(error.type, provided, { max: numberParameterDefaults.max })
  case 'outOfRangeSelectionItems':
    return mapWithNumbers(error.type, provided, numberParameterDefaults)
  default: {
    const unsupported: never = error.type
    throw new Error(`Unsupported selection validation error type: ${unsupported}`)
  }
  }
}
