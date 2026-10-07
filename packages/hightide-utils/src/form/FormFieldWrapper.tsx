import type { FormValues } from './FormStore'
import { useFormStore } from './FormStoreContext'

export type FormFieldWrapperConfig<
  T extends FormValues,
> = {
  isRequired?: boolean | ((values: T) => boolean),
  isDisabled?: boolean | ((values: T) => boolean),
}

export type FormFieldWrapperBag<T extends FormValues, K extends keyof T> = {
  name: K,

  value: T[K],
  error: string | undefined,

  isTouched: boolean,
  isRequired: boolean,
  isDisabled: boolean,

  setValue: (value: T[K]) => void,
  setTouched: (touched?: boolean) => void,
};

type FormFieldWrapperProps<T extends FormValues, K extends keyof T> = {
  name: K,
  config?: FormFieldWrapperConfig<T>,
  children: (field: FormFieldWrapperBag<T, K>) => React.ReactNode,
};

export function FormFieldWrapper<
  T extends FormValues,
  K extends keyof T
>({
  name,
  config,
  children,
}: FormFieldWrapperProps<T, K>) {
  const value = useFormStore<T>()(state => state.values[name])
  const error = useFormStore<T>()(state => state.errors[name])
  const isTouched = useFormStore<T>()(state => state.touched[name] ?? false)

  const setValue = useFormStore<T>()(state => state.setValue)
  const setTouched = useFormStore<T>()(state => state.setTouched)

  const isRequired = useFormStore<T>()(state =>
    typeof config?.isRequired === 'function'
      ? config.isRequired(state.values)
      : config?.isRequired ?? false)

  const isDisabled = useFormStore<T>()(state =>
    typeof config?.isDisabled === 'function'
      ? config.isDisabled(state.values)
      : config?.isDisabled ?? false)

  return children({
    name,
    value,
    error,
    isTouched,
    isRequired,
    isDisabled,
    setValue: value => setValue(name, value),
    setTouched: touched => setTouched(name, touched),
  })
}