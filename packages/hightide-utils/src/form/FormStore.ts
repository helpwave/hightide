import { create, type StoreApi, type UseBoundStore } from 'zustand'

export type FormValues = Record<string, unknown>

export type FormValidator<T extends FormValues> = {
  dependsOn: (keyof T)[] | 'all',
  validatorFn: (values: T) => Partial<Record<keyof T, string | undefined>>,
}

export type CreateFormStoreOptions<T extends FormValues> = {
  initialValues: T,
  initialTouchedValues?: Partial<Record<keyof T, boolean>>,
  validation?: FormValidator<T>[],
}

export type ValidationRunnerState = {
  id: number,
  isRunning: boolean,
  errors: string[],
}

export type FormFieldErrors<T extends FormValues> = Partial<Record<keyof T, string[]>>

export type FormValidationRunnerError<T extends FormValues> = Partial<Record<keyof T, ValidationRunnerState>>

export type FormState<T extends FormValues> = {
  values: T,
  errors: FormFieldErrors<T>,
  validationRunnerError: FormValidationRunnerError<T>,
  touchedValues: Partial<Record<keyof T, boolean>>,

  reset: () => void,
  validate: () => number,

  setValue: <K extends keyof T>(
    field: K,
    value: T[K]
  ) => void,
  setValues: (values: Partial<T>) => void,

  setValidationRunnerError: <K extends keyof T>(
    field: K,
    runner: ValidationRunnerState | undefined
  ) => void,

  setTouchedValue: <K extends keyof T>(
    field: K,
    touched?: boolean
  ) => void,
  setTouchedValues: (touchedValues: Partial<Record<keyof T, boolean>>) => void,
}

export type FormStore<T extends FormValues> =
  UseBoundStore<StoreApi<FormState<T>>>

export const isValidationRunnerInvalid = (runner: ValidationRunnerState | undefined): boolean => {
  if (!runner) return false
  return runner.isRunning || runner.errors.length > 0
}

export const countFormErrors = <T extends FormValues>(
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

const appendFieldError = <T extends FormValues>(
  errors: FormFieldErrors<T>,
  field: keyof T,
  error: string | undefined
) => {
  if (error === undefined) return
  errors[field] = [...(errors[field] ?? []), error]
}

const validatorDependsOnChange = <T extends FormValues>(
  dependsOn: FormValidator<T>['dependsOn'],
  changedFields: (keyof T)[]
) => {
  if (dependsOn === 'all') return true
  return dependsOn.some(field => changedFields.includes(field))
}

const collectErrors = <T extends FormValues>(
  validation: FormValidator<T>[],
  values: T
): FormFieldErrors<T> => {
  const errors: FormFieldErrors<T> = {}

  for (const validator of validation) {
    const result = validator.validatorFn(values)
    for (const field of Object.keys(result) as (keyof T)[]) {
      appendFieldError(errors, field, result[field])
    }
  }

  return errors
}

const revalidateChangedFields = <T extends FormValues>(
  validation: FormValidator<T>[],
  errors: FormFieldErrors<T>,
  values: T,
  changedFields: (keyof T)[]
): FormFieldErrors<T> => {
  const affected = validation.filter(validator => validatorDependsOnChange(validator.dependsOn, changedFields))
  const resetFields = new Set<keyof T>(changedFields)
  const results = new Map<FormValidator<T>, Partial<Record<keyof T, string | undefined>>>()

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

  for (const validator of validation) {
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

export function createFormStore<T extends FormValues>({
  initialValues,
  initialTouchedValues = {},
  validation = [],
}: CreateFormStoreOptions<T>): FormStore<T> {
  return create<FormState<T>>((set, get) => ({
    values: { ...initialValues },
    errors: collectErrors(validation, initialValues),
    validationRunnerError: {},
    touchedValues: { ...initialTouchedValues },

    setValues: (values) => {
      set(state => {
        const nextValues = { ...state.values, ...values }
        return {
          values: nextValues,
          errors: revalidateChangedFields(validation, state.errors, nextValues, Object.keys(values) as (keyof T)[]),
        }
      })
    },

    reset: () => {
      set({
        values: { ...initialValues },
        errors: collectErrors(validation, initialValues),
        validationRunnerError: {},
        touchedValues: { ...initialTouchedValues },
      })
    },

    validate: () => {
      const errors = collectErrors(validation, get().values)
      set({ errors })
      return countFormErrors(errors, get().validationRunnerError)
    },

    setValue: (field, value) => {
      set(state => {
        const nextValues = {
          ...state.values,
          [field]: value,
        }
        return {
          values: nextValues,
          errors: revalidateChangedFields(validation, state.errors, nextValues, [field]),
        }
      })
    },

    setValidationRunnerError: (field, runner) => {
      set(state => {
        const validationRunnerError = { ...state.validationRunnerError }
        if (runner) {
          validationRunnerError[field] = runner
        } else {
          delete validationRunnerError[field]
        }
        return { validationRunnerError }
      })
    },

    setTouchedValue: (field, touched = true) => {
      set(state => ({
        touchedValues: {
          ...state.touchedValues,
          [field]: touched,
        },
      }))
    },

    setTouchedValues: (touchedValues) => {
      set(state => ({
        touchedValues: {
          ...state.touchedValues,
          ...touchedValues,
        },
      }))
    },
  }))
}
