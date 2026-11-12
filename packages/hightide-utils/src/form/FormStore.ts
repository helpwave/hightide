import type { StateStore } from '../interfaces/state-store'
import type { FormError } from '../utils/form-validation'

export type { FormError } from '../utils/form-validation'

export type FormValue = Record<string, unknown>

export type FormValidator<T extends FormValue> = {
  dependsOn: (keyof T)[] | 'all',
  validatorFn: (values: T) => Partial<Record<keyof T, FormError | undefined>>,
}

export type FormFieldStateRule<T extends FormValue, K extends keyof T = keyof T> = {
  field: K,
  dependsOn?: (keyof T)[] | 'all',
  isRequired?: boolean | ((values: T) => boolean),
  isDisabled?: boolean | ((values: T) => boolean),
  isReadOnly?: boolean | ((values: T) => boolean),
}

export type CreateFormStoreOptions<T extends FormValue> = {
  initialValues: T,
  validators?: FormValidator<T>[],
  fieldStateRules?: FormFieldStateRule<T>[],
}

export type ValidationRunnerState = {
  id: number,
  isRunning: boolean,
  errors: FormError[],
}

export type ValidationRunner = ValidationRunnerState

export type FormFieldErrors<T extends FormValue> = Partial<Record<keyof T, FormError[]>>

export type FormValidationRunnerError<T extends FormValue> = Partial<Record<keyof T, ValidationRunner>>

export type FormFieldFlags = {
  isRequired: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
}

export type FormState<T extends FormValue> = {
  initialValues: T,
  validators: FormValidator<T>[],
  fieldStateRules: FormFieldStateRule<T>[],
  values: T,
  errors: FormFieldErrors<T>,
  validationRunnerError: FormValidationRunnerError<T>,
  hasInteracted: Partial<Record<keyof T, boolean>>,
  fieldFlags: Partial<Record<keyof T, FormFieldFlags>>,
}

type FormKey<T extends FormValue> = Extract<keyof T, string>

export type FormEvent<T extends FormValue> =
  | { type: 'interacted', name: FormKey<T> }
  | { type: 'changed', name: FormKey<T>, value: T[FormKey<T>] }
  | { type: 'validated', name: FormKey<T>, errors: FormError[] }
  | { type: 'changeValues', values: Partial<T> }
  | { type: 'addValidationRunner', name: FormKey<T>, value: ValidationRunner }
  | { type: 'updateValidationRunner', name: FormKey<T>, value: ValidationRunner }
  | { type: 'changeState', name: FormKey<T>, isDisabled?: boolean, isReadOnly?: boolean, isRequired?: boolean }
  | { type: 'reset' }

export type FormStore<T extends FormValue> = StateStore<FormState<T>>

export type FormTransition<T extends FormValue> = (state: FormState<T>, event: FormEvent<T>) => FormState<T>

const emptyFlags: FormFieldFlags = {
  isRequired: false,
  isDisabled: false,
  isReadOnly: false,
}

export const isValidationRunnerInvalid = (runner: ValidationRunner | undefined): boolean => {
  if (!runner) return false
  return runner.isRunning || runner.errors.length > 0
}

export const countFormErrors = <T extends FormValue>(
  errors: FormFieldErrors<T>,
  validationRunnerError: FormValidationRunnerError<T>
): number => {
  const fields = new Set<keyof T>([
    ...(Object.keys(errors) as (keyof T)[]),
    ...(Object.keys(validationRunnerError) as (keyof T)[]),
  ])

  let count = 0
  for (const field of fields) {
    count += errors[field]?.length ?? 0
    const runner = validationRunnerError[field]
    if (!runner) continue
    if (runner.isRunning && runner.errors.length === 0) {
      count += 1
      continue
    }
    count += runner.errors.length
  }

  return count
}

const appendFieldError = <T extends FormValue>(
  errors: FormFieldErrors<T>,
  field: keyof T,
  error: FormError | undefined
) => {
  if (error === undefined) return
  errors[field] = [...(errors[field] ?? []), error]
}

const dependsOnChange = <T extends FormValue>(
  dependsOn: (keyof T)[] | 'all' | undefined,
  changedFields: (keyof T)[]
) => {
  const dependency = dependsOn ?? 'all'
  if (dependency === 'all') return true
  return dependency.some(field => changedFields.includes(field))
}

export const collectFormErrors = <T extends FormValue>(
  validators: FormValidator<T>[],
  values: T
): FormFieldErrors<T> => {
  const errors: FormFieldErrors<T> = {}

  for (const validator of validators) {
    const result = validator.validatorFn(values)
    for (const field of Object.keys(result) as (keyof T)[]) {
      appendFieldError(errors, field, result[field])
    }
  }

  return errors
}

const revalidateChangedFields = <T extends FormValue>(
  validators: FormValidator<T>[],
  errors: FormFieldErrors<T>,
  values: T,
  changedFields: (keyof T)[]
): FormFieldErrors<T> => {
  const affected = validators.filter(validator => dependsOnChange(validator.dependsOn, changedFields))
  const resetFields = new Set<keyof T>(changedFields)
  const results = new Map<FormValidator<T>, Partial<Record<keyof T, FormError | undefined>>>()

  for (const validator of affected) {
    const result = validator.validatorFn(values)
    results.set(validator, result)
    for (const field of Object.keys(result) as (keyof T)[]) {
      resetFields.add(field)
    }
  }

  const nextErrors: FormFieldErrors<T> = { ...errors }
  for (const field of resetFields) {
    nextErrors[field] = []
  }

  for (const validator of validators) {
    const result = results.get(validator) ?? validator.validatorFn(values)
    for (const field of Object.keys(result) as (keyof T)[]) {
      if (!resetFields.has(field)) continue
      appendFieldError(nextErrors, field, result[field])
    }
  }

  for (const field of resetFields) {
    if (!nextErrors[field]?.length) {
      delete nextErrors[field]
    }
  }

  return nextErrors
}

type FlagSource<T extends FormValue> = boolean | ((values: T) => boolean) | undefined

const readFlag = <T extends FormValue>(
  source: FlagSource<T>,
  values: T,
  fallback: boolean
): boolean => {
  if (typeof source === 'function') return source(values)
  if (typeof source === 'boolean') return source
  return fallback
}

const hasFlagFunction = <T extends FormValue>(rule: FormFieldStateRule<T>): boolean => {
  return typeof rule.isRequired === 'function'
    || typeof rule.isDisabled === 'function'
    || typeof rule.isReadOnly === 'function'
}

const flagsEqual = (left: FormFieldFlags, right: FormFieldFlags): boolean => {
  return left.isRequired === right.isRequired
    && left.isDisabled === right.isDisabled
    && left.isReadOnly === right.isReadOnly
}

const applyRule = <T extends FormValue>(
  rule: FormFieldStateRule<T>,
  values: T,
  current: FormFieldFlags,
  functionsOnly: boolean
): FormFieldFlags => {
  return {
    isRequired: functionsOnly && typeof rule.isRequired !== 'function'
      ? current.isRequired
      : readFlag(rule.isRequired, values, current.isRequired),
    isDisabled: functionsOnly && typeof rule.isDisabled !== 'function'
      ? current.isDisabled
      : readFlag(rule.isDisabled, values, current.isDisabled),
    isReadOnly: functionsOnly && typeof rule.isReadOnly !== 'function'
      ? current.isReadOnly
      : readFlag(rule.isReadOnly, values, current.isReadOnly),
  }
}

const resolveFieldFlags = <T extends FormValue>(
  rules: FormFieldStateRule<T>[],
  values: T
): Partial<Record<keyof T, FormFieldFlags>> => {
  const flags: Partial<Record<keyof T, FormFieldFlags>> = {}
  for (const rule of rules) {
    const current = flags[rule.field] ?? emptyFlags
    flags[rule.field] = applyRule(rule, values, current, false)
  }
  return flags
}

const recomputeFieldFlags = <T extends FormValue>(
  rules: FormFieldStateRule<T>[],
  flags: Partial<Record<keyof T, FormFieldFlags>>,
  values: T,
  changedFields: (keyof T)[]
): Partial<Record<keyof T, FormFieldFlags>> => {
  let next = flags
  for (const rule of rules) {
    if (!hasFlagFunction(rule)) continue
    if (!dependsOnChange(rule.dependsOn, changedFields)) continue
    const current = next[rule.field] ?? emptyFlags
    const resolved = applyRule(rule, values, current, true)
    if (flagsEqual(current, resolved)) continue
    if (next === flags) next = { ...flags }
    next[rule.field] = resolved
  }
  return next
}

const replaceErrors = <T extends FormValue>(
  errors: FormFieldErrors<T>,
  name: keyof T,
  nextErrors: FormError[]
): FormFieldErrors<T> => {
  const errorsForField = { ...errors }
  if (nextErrors.length === 0) {
    delete errorsForField[name]
  } else {
    errorsForField[name] = nextErrors
  }
  return errorsForField
}

const writeValue = <T extends FormValue>(values: T, name: keyof T, value: T[keyof T]): T => {
  return { ...values, [name]: value }
}

export function createFormState<T extends FormValue>({
  initialValues,
  validators = [],
  fieldStateRules = [],
}: CreateFormStoreOptions<T>): FormState<T> {
  return {
    initialValues: { ...initialValues },
    validators,
    fieldStateRules,
    values: { ...initialValues },
    errors: collectFormErrors(validators, initialValues),
    validationRunnerError: {},
    hasInteracted: {},
    fieldFlags: resolveFieldFlags(fieldStateRules, initialValues),
  }
}

export function formStateTransition<T extends FormValue>(state: FormState<T>, event: FormEvent<T>): FormState<T> {
  switch (event.type) {
  case 'changed': {
    const nextValues = writeValue(state.values, event.name, event.value)
    return {
      ...state,
      values: nextValues,
      errors: revalidateChangedFields(state.validators, state.errors, nextValues, [event.name]),
      fieldFlags: recomputeFieldFlags(state.fieldStateRules, state.fieldFlags, nextValues, [event.name]),
    }
  }
  case 'changeValues': {
    const changedFields = Object.keys(event.values) as (keyof T)[]
    const nextValues = { ...state.values, ...event.values }
    return {
      ...state,
      values: nextValues,
      errors: revalidateChangedFields(state.validators, state.errors, nextValues, changedFields),
      fieldFlags: recomputeFieldFlags(state.fieldStateRules, state.fieldFlags, nextValues, changedFields),
    }
  }
  case 'interacted': {
    if (state.hasInteracted[event.name]) return state
    return {
      ...state,
      hasInteracted: {
        ...state.hasInteracted,
        [event.name]: true,
      },
    }
  }
  case 'validated':
    return {
      ...state,
      errors: replaceErrors(state.errors, event.name, event.errors),
    }
  case 'addValidationRunner': {
    if (state.validationRunnerError[event.name]) return state
    return {
      ...state,
      validationRunnerError: {
        ...state.validationRunnerError,
        [event.name]: event.value,
      },
    }
  }
  case 'updateValidationRunner': {
    if (!state.validationRunnerError[event.name]) return state
    return {
      ...state,
      validationRunnerError: {
        ...state.validationRunnerError,
        [event.name]: event.value,
      },
    }
  }
  case 'changeState': {
    const current = state.fieldFlags[event.name] ?? emptyFlags
    const nextFlags: FormFieldFlags = {
      isRequired: event.isRequired ?? current.isRequired,
      isDisabled: event.isDisabled ?? current.isDisabled,
      isReadOnly: event.isReadOnly ?? current.isReadOnly,
    }
    if (state.fieldFlags[event.name] && flagsEqual(current, nextFlags)) return state
    return {
      ...state,
      fieldFlags: {
        ...state.fieldFlags,
        [event.name]: nextFlags,
      },
    }
  }
  case 'reset':
    return createFormState({
      initialValues: state.initialValues,
      validators: state.validators,
      fieldStateRules: state.fieldStateRules,
    })
  }
}
