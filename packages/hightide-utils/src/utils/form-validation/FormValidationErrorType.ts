const stringFormValidationErrorTypeValues = [
  'notEmpty',
  'invalidEmail',
  'tooShort',
  'tooLong',
  'outOfRangeString',
] as const

const numberFormValidationErrorTypeValues = [
  'notEmpty',
  'outOfRangeNumber',
] as const

const selectionFormValidationErrorTypeValues = [
  'notEmpty',
  'tooFewSelectionItems',
  'tooManySelectionItems',
  'outOfRangeSelectionItems',
] as const

const formValidationErrorTypeValues = [
  'notEmpty',
  'invalidEmail',
  'tooShort',
  'tooLong',
  'outOfRangeString',
  'outOfRangeNumber',
  'tooFewSelectionItems',
  'tooManySelectionItems',
  'outOfRangeSelectionItems',
] as const

export type StringFormValidationErrorType = (typeof stringFormValidationErrorTypeValues)[number]

export type NumberFormValidationErrorType = (typeof numberFormValidationErrorTypeValues)[number]

export type SelectionFormValidationErrorType = (typeof selectionFormValidationErrorTypeValues)[number]

export type FormValidationErrorType = (typeof formValidationErrorTypeValues)[number]

export type FormValidationResult = FormValidationErrorType | undefined

const allowedFormValidationErrorTypeValues: ReadonlySet<string> = new Set(formValidationErrorTypeValues)

function isFormValidationErrorTypeValue(value: unknown): value is FormValidationErrorType {
  if (typeof value !== 'string') return false
  return allowedFormValidationErrorTypeValues.has(value)
}

export const FormValidationErrorTypeUtils = {
  array: formValidationErrorTypeValues,
  string: stringFormValidationErrorTypeValues,
  number: numberFormValidationErrorTypeValues,
  selection: selectionFormValidationErrorTypeValues,
  set: allowedFormValidationErrorTypeValues,
  typeCheck: isFormValidationErrorTypeValue,
}
