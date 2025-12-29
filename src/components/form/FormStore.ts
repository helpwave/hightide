import type { ReactNode } from 'react'

export type FormValidationBehaviour = 'always' | 'touched' | 'submit'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValue =  Record<string, any>

export type FormEvent<T extends FormValue> = {
  type: 'submit',
  key: 'ALL',
  values: T,
} | {
  type: 'submitError',
  key: 'ALL',
  values: T,
  errors: Partial<Record<keyof T, ReactNode>>,
} | {
  type: 'reset',
  key: 'ALL',
  values: T,
  errors: Partial<Record<keyof T, ReactNode>>,
} | {
  type: 'onChange',
  key: keyof T,
  value: T[keyof T],
} | {
  type: 'onError',
  key: keyof T,
  value: T[keyof T],
  error: ReactNode,
}

export type FormEventListener<T extends FormValue> = (event: FormEvent<T>) => void

export type FormValidator<T extends FormValue> = (value: T[keyof T]) => ReactNode

export type FormStoreProps<T extends FormValue> = {
  initialValues: T,
  hasTriedSubmitting?: boolean,
  validators?: Partial<{ [K in keyof T]: (v: T[K]) => ReactNode }>,
  validationBehaviour?: FormValidationBehaviour,
}

export class FormStore<T extends FormValue> {
  private values: T
  private initialValues: T
  private validators: Partial<{ [K in keyof T]: FormValidator<T> }>
  private validationBehaviour: FormValidationBehaviour

  private hasTriedSubmitting: boolean = false
  private errors: Partial<Record<keyof T, ReactNode>> = {}
  private touched: Partial<Record<keyof T, boolean>> = {}

  private listeners = new Map<keyof T | 'ALL', Set<FormEventListener<T>>>()

  constructor({
    initialValues,
    hasTriedSubmitting,
    validators = {},
    validationBehaviour = 'touched',
  }: FormStoreProps<T>) {
    this.initialValues = initialValues
    this.values = { ...initialValues }
    this.hasTriedSubmitting = hasTriedSubmitting
    this.validators = validators
    this.validationBehaviour = validationBehaviour
    this.validateAll()
  }

  // Values
  getValue<K extends keyof T>(key: K): T[K] {
    return this.values[key]
  }

  getAllValues(): T {
    return { ...this.values }
  }

  setValue<K extends keyof T>(key: K, value: T[K]) {
    if (this.values[key] === value) return

    this.values[key] = value
    this.validate(key)
    this.notify({ type: 'onChange', key, value })
  }

  setValues<K extends keyof T>(values: Partial<T[K]>) {
    Object.keys(values).forEach(key => this.setValue(key, values[key]))
  }

  // Touched
  getTouched(key: keyof T): boolean {
    return !!this.touched[key]
  }

  setTouched(key: keyof T, isTouched: boolean = true) {
    if (this.touched[key] === isTouched) return

    this.touched[key] = isTouched
    this.validate(key)
  }

  // Error and Validation
  getHasError() : boolean {
    return Object.values(this.errors).some(value => value !== undefined && value !== null)
  }

  getError(key: keyof T): ReactNode {
    return this.errors[key]
  }

  private setError(key: keyof T, error: ReactNode) {
    if (this.errors[key] === error) return

    if (error === undefined || error === null) {
      delete this.errors[key]
    } else {
      this.errors[key] = error
    }

    this.notify({ type: 'onError', key,  value: this.values[key], error })
  }

  changeValidationBehavoir(validationBehaviour: FormValidationBehaviour) {
    if(validationBehaviour === this.validationBehaviour) return
    this.validationBehaviour = validationBehaviour
    this.validateAll()
  }

  changeValidators(validators: Partial<Record<keyof T, FormValidator<T>>>) {
    this.validators = { ...this.validators, ...validators }
    this.validateAll()
  }

  validate(key: keyof T) {
    const validator = this.validators[key]

    const shouldValidate =
      this.validationBehaviour === 'always' ||
      (this.validationBehaviour === 'touched' && this.touched[key]) ||
      (this.validationBehaviour === 'submit' && this.hasTriedSubmitting)

    if (!validator || !shouldValidate) {
      this.setError(key, undefined)
      return
    }

    const error = validator(this.values[key])
    this.setError(key, error)
  }

  validateAll() {
    Object.keys(this.initialValues).forEach(key => {
      this.validate(key)
    })
  }

  // Obeserver
  subscribe(key: keyof T | 'ALL', listener: FormEventListener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)!.add(listener)

    return () => {
      this.listeners.get(key)?.delete(listener)
      if (this.listeners.get(key)?.size === 0) {
        this.listeners.delete(key)
      }
    }
  }

  private notify(event: FormEvent<T>) {
    const key = event.key
    if(key !== 'ALL') {
      this.listeners.get(key)?.forEach((listener) => listener(event))
    }
    this.listeners.get('ALL')?.forEach((listener) => listener(event))
  }

  // Form
  submit() {
    this.hasTriedSubmitting = true

    // Mark all as touched on submit
    Object.keys(this.initialValues).forEach((k) => {
      this.touched[k as keyof T] = true
      this.validate(k as keyof T)
    })

    const hasErrors = Object.keys(this.errors).length > 0

    if (hasErrors) {
      this.notify({
        type: 'submitError',
        key: 'ALL',
        errors: this.errors,
        values: this.values
      })
    } else {
      this.notify({
        type: 'submit',
        key: 'ALL',
        values: this.values
      })
    }
  }

  reset() {
    this.values = { ...this.initialValues }
    this.hasTriedSubmitting = false
    this.touched = {}
    Object.keys(this.initialValues).forEach(key => {
      this.notify({ type: 'onChange', key: key, value: this.values[key] })
    })
    this.validateAll()
    this.notify({ type: 'reset', key: 'ALL',  values: this.values, errors: this.errors })
  }
}