import { useRef, type FocusEvent, type ReactNode, type Ref, type RefObject } from 'react'
import { useDebouncer, useDelay, useStableEvent, useThrottle } from '@helpwave/hightide-utils/hooks'
import type { FormFieldAriaAttributes, FormFieldIds } from '../FormField/FormFieldContext'
import type { FormFieldInputProps } from '../FormField/FormFieldInput'
import { FormField } from '../FormField/FormField'
import type { FormValue } from '../Form/FormContext'

export type WiredKeys = 'value' | 'initialValue' | 'onValueChange' | 'onStateEvent' | 'isInvalid' | 'isDisabled' | 'isReadOnly' | 'isRequired' | 'id'

export type StringKey<T> = Extract<keyof T, string>

export type FieldKey<T extends FormValue, TValue> = {
  [K in StringKey<T>]: T[K] extends TValue | undefined ? K : never
}[StringKey<T>]

export type FormInputFieldOwnProps<T extends FormValue, K extends keyof T> = {
  name: K,
  label?: ReactNode,
  description?: ReactNode,
  requiredIndicator?: ReactNode,
  ids?: Partial<FormFieldIds>,
}

type BlurHandler = {
  onBlur?: (event: FocusEvent<HTMLElement>) => void,
}

export const ariaProps = (field: FormFieldInputProps<unknown>): FormFieldAriaAttributes => ({
  'aria-labelledby': field['aria-labelledby'],
  'aria-describedby': field['aria-describedby'],
  'aria-disabled': field['aria-disabled'],
  'aria-readonly': field['aria-readonly'],
  'aria-invalid': field['aria-invalid'],
  'aria-errormessage': field['aria-errormessage'],
  'aria-required': field['aria-required'],
})

export const bindState = <T,>(field: FormFieldInputProps<T>) => ({
  id: field.id,
  value: field.value,
  isInvalid: field.isInvalid,
  isDisabled: field.isDisabled,
  isReadOnly: field.isReadOnly,
  isRequired: field.isRequired,
})

export const mergeBlur = <TProps extends object>(props: TProps | undefined, onInteracted: () => void): TProps => {
  const current = props as (TProps & BlurHandler) | undefined
  return {
    ...props,
    onBlur: (event: FocusEvent<HTMLElement>) => {
      current?.onBlur?.(event)
      onInteracted()
    },
  } as TProps
}

export const elementRef = <T extends HTMLElement>(ref: RefObject<HTMLElement | null>): Ref<T> => {
  return ref as Ref<T>
}

export type FormInputInteractionConfig = {
  debounce?: number | null,
  throttle?: number,
  delay?: number,
}

const defaultInteractionDebounce = 1500

export function useFormInputInteraction(config: FormInputInteractionConfig, onInteracted: () => void) {
  const onInteractedStable = useStableEvent(onInteracted)
  const debounce = config.debounce === undefined
    ? (config.throttle == null && config.delay == null ? defaultInteractionDebounce : undefined)
    : config.debounce
  const withDebounce = useDebouncer(typeof debounce === 'number' ? debounce : 0)
  const withThrottle = useThrottle(config.throttle ?? 0)
  const { restartTimer, clearTimer } = useDelay({
    delay: config.delay ?? 0,
    disabled: config.delay == null,
  })
  const generation = useRef(0)

  const schedule = () => {
    const current = generation.current + 1
    generation.current = current
    const run = () => {
      if (generation.current !== current) return
      onInteractedStable()
    }
    if (typeof debounce === 'number') {
      withDebounce(run, debounce)
      return
    }
    if (typeof config.throttle === 'number') {
      withThrottle(run, config.throttle)
      return
    }
    if (typeof config.delay === 'number') {
      restartTimer(run)
    }
  }

  const interactNow = () => {
    generation.current += 1
    clearTimer()
    onInteractedStable()
  }

  return { schedule, interactNow }
}

export function createFormInputField<TValue, Extra extends object>(
  render: (field: FormFieldInputProps<TValue>, extra: Extra) => ReactNode
) {
  const Bound = <T extends FormValue, K extends FieldKey<T, TValue>>(
    props: FormInputFieldOwnProps<T, K> & Extra
  ) => {
    const { name, label, description, requiredIndicator, ids, ...extra } = props
    return (
      <FormField<T, K>
        name={name}
        label={label}
        description={description}
        requiredIndicator={requiredIndicator}
        ids={ids}
      >
        {(field) => render(field as FormFieldInputProps<TValue>, extra as Extra)}
      </FormField>
    )
  }
  return Bound
}
