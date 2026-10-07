import { create, type StoreApi, type UseBoundStore } from 'zustand'

export type FormValues = Record<string, unknown>

export type FormState<T extends FormValues> = {
  values: T,
  errors: Partial<Record<keyof T, string>>,
  touched: Partial<Record<keyof T, boolean>>,

  setValues: (values: Partial<T>) => void,
  reset: () => void,

  setValue: <K extends keyof T>(
    field: K,
    value: T[K]
  ) => void,

  setError: <K extends keyof T>(
    field: K,
    error: string | undefined
  ) => void,

  setTouched: <K extends keyof T>(
    field: K,
    touched?: boolean
  ) => void,
};

export type FormStore<T extends FormValues> =
  UseBoundStore<StoreApi<FormState<T>>>;

export function createFormStore<
  T extends FormValues
>(
  initialValues: T
): FormStore<T> {
  return create<FormState<T>>((set) => ({
    values: initialValues,
    errors: {},
    touched: {},

    setValues: (values: Partial<T>) => {
      set(state => ({
        ...state,
        values: {
          ...state.values,
          ...values
        }
      }))
    },

    reset: () => {
      set({
        values: initialValues,
        errors: {},
        touched: {},
      })
    },

    setValue: (field, value) => {
      set(state => ({
        values: {
          ...state.values,
          [field]: value,
        },
      }))
    },

    setTouched: (field, touched = true) => {
      set(state => ({
        touched: {
          ...state.touched,
          [field]: touched,
        },
      }))
    },

    setError: (field, error) => {
      set(state => ({
        errors: {
          ...state.errors,
          [field]: error,
        },
      }))
    },
  }))
}