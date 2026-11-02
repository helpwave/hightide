import type { InputStateEvent } from '../interfaces/input'
import type { FormValues, ValidationRunnerState } from './FormStore'
import { useFormStore } from './FormStoreContext'
import { useFieldTouchedTrigger, type TouchedTrigger } from './useFieldTouchedTrigger'

const emptyFieldErrors: string[] = []

export type FormFieldWrapperConfig<
  T extends FormValues,
  E extends InputStateEvent = InputStateEvent
> = {
  isRequired?: boolean | ((values: T) => boolean),
  isDisabled?: boolean | ((values: T) => boolean),
  touchedTrigger?: TouchedTrigger<E>,
}

export type FormFieldWrapperBag<T extends FormValues, K extends keyof T, E extends InputStateEvent = InputStateEvent> = {
  name: K,

  value: T[K],
  errors: string[],
  validationRunnerError: ValidationRunnerState | undefined,

  isTouched: boolean,
  isRequired: boolean,
  isDisabled: boolean,

  setValue: (value: T[K]) => void,
  setTouched: (touched?: boolean) => void,
  onStateEvent: (event: E) => void,
};

type FormFieldWrapperProps<T extends FormValues, K extends keyof T, E extends InputStateEvent = InputStateEvent> = {
  name: K,
  config?: FormFieldWrapperConfig<T, E>,
  children: (field: FormFieldWrapperBag<T, K, E>) => React.ReactNode,
};

export function FormFieldWrapper<
  T extends FormValues,
  K extends keyof T,
  E extends InputStateEvent = InputStateEvent
>({
  name,
  config,
  children,
}: FormFieldWrapperProps<T, K, E>) {
  const value = useFormStore<T>()(state => state.values[name])
  const errors = useFormStore<T>()(state => state.errors[name]) ?? emptyFieldErrors
  const validationRunnerError = useFormStore<T>()(state => state.validationRunnerError[name])
  const isTouched = useFormStore<T>()(state => state.touchedValues[name] ?? false)

  const setValue = useFormStore<T>()(state => state.setValue)
  const setTouchedValue = useFormStore<T>()(state => state.setTouchedValue)
  const onStateEvent = useFieldTouchedTrigger<E>(config?.touchedTrigger, value, () => {
    setTouchedValue(name, true)
  })

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
    errors,
    validationRunnerError,
    isTouched,
    isRequired,
    isDisabled,
    setValue: value => setValue(name, value),
    setTouched: touched => setTouchedValue(name, touched ?? true),
    onStateEvent,
  })
}