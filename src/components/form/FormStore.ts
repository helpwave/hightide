import type { ReactNode } from 'react'

export type FormValidationBehaviour = 'always' | 'touched' | 'submit'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValue =  Record<string, any>

export type FormEvent<T extends FormValue> = {
  type: 'onSubmit',
  key: 'ALL',
  hasErrors: boolean,
  values: T,
  errors: Partial<Record<keyof T, ReactNode>>,
} | {
  type: 'reset',
  key: 'ALL',
  values: T,
  errors: Partial<Record<keyof T, ReactNode>>,
} | {
  type: 'onTouched',
  key: keyof T,
  value: T[keyof T],
  values: T,
} | {
  type: 'onUpdate',
  key: 'ALL',
  updatedKeys: (keyof T)[],
  update: Partial<T>,
  values: T,
  hasErrors: boolean,
  errors: Partial<Record<keyof T, ReactNode>>,
} | {
  type: 'onChange',
  key: keyof T,
  value: T[keyof T],
  values: T,
} | {
  type: 'onError',
  key: keyof T,
  value: T[keyof T],
  values: T,
  error: ReactNode,
}

export type FormEventListener<T extends FormValue> = (event: FormEvent<T>) => void

export type FormValidator<T extends FormValue> = (value: T[keyof T]) => ReactNode

export type FormStoreProps<T extends FormValue> = {
  initialValues: T,
  hasTriedSubmitting?: boolean,
  submittingTouchesAll?: boolean,
  validators?: Partial<{ [K in keyof T]: (v: T[K]) => ReactNode }>,
}

export class FormStore<T extends FormValue> {
  private values: T
  private initialValues: T
  private validators: Partial<{ [K in keyof T]: FormValidator<T> }>

  private hasTriedSubmitting: boolean = false
  private errors: Partial<Record<keyof T, ReactNode>> = {}
  private touched: Partial<Record<keyof T, boolean>> = {}

  private listeners = new Map<keyof T | 'ALL', Set<FormEventListener<T>>>()
  private submittingTouchesAll: boolean = false


  constructor({
    initialValues,
    hasTriedSubmitting,
    submittingTouchesAll = true,
    validators = {},
  }: FormStoreProps<T>) {
    this.initialValues = initialValues
    this.values = { ...initialValues }

    this.hasTriedSubmitting = hasTriedSubmitting
    this.submittingTouchesAll = submittingTouchesAll
    if(this.submittingTouchesAll && this.hasTriedSubmitting) {
      Object.keys(this.initialValues).forEach(key => {
        this.touched[key as keyof T] = true
      })
    }

    this.validators = validators
    this.validateAll()
  }

  // Values
  getValue<K extends keyof T>(key: K): T[K] {
    return this.values[key]
  }

  getAllValues(): T {
    return this.values
  }

  setValue<K extends keyof T>(key: K, value: T[K], triggerUpdate: boolean = false) {
    if (this.values[key] !== value) {
      this.values[key] = value

      this.notify({ type: 'onChange', key, value, values: this.values })
      this.validate(key)
    }

    if(triggerUpdate) {
      this.notify({
        type: 'onUpdate',
        key: 'ALL',
        updatedKeys: [key],
        update: { [key]: value } as unknown as Partial<T>,
        values: this.values,
        hasErrors: this.getHasError(),
        errors: this.getErrors()
      })
    }
  }

  setValues(values: Partial<T>, triggerUpdate: boolean = false) {
    Object.keys(values).forEach(key => this.setValue(key, values[key]))

    if(triggerUpdate) {
      this.notify({
        type: 'onUpdate',
        key: 'ALL',
        updatedKeys: Object.keys(values) as (keyof T)[],
        update: values,
        values: this.values,
        hasErrors: this.getHasError(),
        errors: this.getErrors()
      })
    }
  }

  // Touched
  getTouched(key: keyof T): boolean {
    return !!this.touched[key]
  }

  getAllTouched(): Partial<Record<keyof T, boolean>> {
    return this.touched
  }

  setTouched(key: keyof T, isTouched: boolean = true) {
    if (this.touched[key] === isTouched) return

    this.touched[key] = isTouched
    this.notify({ type: 'onTouched', key, value: this.values[key], values: this.values })
  }

  // Error and Validation
  getHasError() : boolean {
    return Object.values(this.errors).some(value => value !== undefined && value !== null)
  }

  getErrors(): Partial<Record<keyof T, ReactNode>> {
    return this.errors
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

    this.notify({ type: 'onError', key,  value: this.values[key], error, values: this.values })
  }

  getHasTriedSubmitting(): boolean {
    return this.hasTriedSubmitting
  }

  changeValidators(validators: Partial<Record<keyof T, FormValidator<T>>>) {
    this.validators = { ...this.validators, ...validators }
    this.validateAll()
  }

  validate(key: keyof T) {
    const validator = this.validators[key]

    if (!validator) {
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

    if(this.submittingTouchesAll) {
      Object.keys(this.initialValues).forEach((k) => {
        this.touched[k as keyof T] = true
      })
    }

    const hasErrors = Object.keys(this.errors).length > 0

    this.notify({
      type: 'onSubmit',
      key: 'ALL',
      hasErrors: hasErrors,
      errors: this.errors,
      values: this.values
    })
  }

  reset() {
    this.values = { ...this.initialValues }
    this.hasTriedSubmitting = false
    this.touched = {}
    Object.keys(this.initialValues).forEach(key => {
      this.notify({ type: 'onChange', key: key, value: this.values[key], values: this.values })
    })
    this.validateAll()
    this.notify({ type: 'reset', key: 'ALL',  values: this.values, errors: this.errors })
  }
}