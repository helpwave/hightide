import type { HTMLAttributes, ReactNode } from 'react'
import { useId, useMemo, forwardRef } from 'react'

export type FormFieldAriaAttributes = Pick<HTMLAttributes<HTMLElement>, 'aria-labelledby' | 'aria-describedby' | 'aria-disabled' | 'aria-readonly' | 'aria-invalid' | 'aria-errormessage' | 'aria-required'>

export type FormFieldInteractionStates = {
  invalid: boolean,
  disabled: boolean,
  readOnly: boolean,
  required: boolean,
}

export type FormFieldLayoutIds = {
  input: string,
  error: string,
  label: string,
  description: string,
}

export type FormFieldLayoutBag = {
  interactionStates: FormFieldInteractionStates,
  ariaAttributes: FormFieldAriaAttributes,
  id: string,
}

export type FormFieldLayoutProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & Omit<Partial<FormFieldInteractionStates>, 'invalid'> & {
  children: (bag: FormFieldLayoutBag) => ReactNode,
  ids?: Partial<FormFieldLayoutIds>,
  label?: ReactNode,
  labelProps?: Omit<HTMLAttributes<HTMLLabelElement>, 'children' | 'id'>,
  invalidDescription?: ReactNode,
  invalidDescriptionProps?: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'>,
  description?: ReactNode,
  descriptionProps?: Omit<HTMLAttributes<HTMLParagraphElement>, 'children' | 'id'>,
  showRequiredIndicator?: boolean,
}

export const FormFieldLayout = forwardRef<HTMLDivElement, FormFieldLayoutProps>(function FormFieldLayout({
  children,
  ids: idOverwrites = {},
  required = false,
  disabled = false,
  readOnly = false,
  label,
  labelProps,
  invalidDescription,
  invalidDescriptionProps,
  description,
  descriptionProps,
  showRequiredIndicator = true,
  ...props
}, ref) {
  const generatedId = useId()

  const ids = useMemo(() => ({
    input: idOverwrites.input ?? `form-field-input-${generatedId}`,
    error: idOverwrites.error ?? `form-field-error-${generatedId}`,
    label: idOverwrites.label ?? `form-field-label-${generatedId}`,
    description: idOverwrites.description ?? `form-field-description-${generatedId}`
  }), [generatedId, idOverwrites])

  const describedBy: string = [
    description ? ids.description : undefined,
    invalidDescription ? ids.error : undefined,
  ].filter(Boolean).join(' ')

  const invalid = !!invalidDescription

  const inputAriaAttributes: FormFieldAriaAttributes = useMemo(() => ({
    'aria-required': required,
    'aria-describedby': describedBy,
    'aria-labelledby': label ? ids.label : undefined,
    'aria-invalid': invalid,
    'aria-errormessage': invalid ? ids.error : undefined,
  }), [describedBy, ids.error, ids.label, invalid, label, required])

  const state: FormFieldInteractionStates = useMemo(() => ({
    disabled,
    invalid,
    readOnly,
    required,
  }), [disabled, invalid, readOnly, required])

  const bag: FormFieldLayoutBag = {
    interactionStates: state,
    ariaAttributes: inputAriaAttributes,
    id: ids.input,
  }

  return (
    <div
      {...props}
      ref={ref}

      data-name={props['data-name'] ?? 'form-field-container'}
    >
      {label && (
        <label
          {...labelProps}
          id={ids.label}
          htmlFor={ids.input}
          data-name={labelProps?.['data-name'] ?? 'form-field-label'}
        >
          {label}
          {showRequiredIndicator && required && <div role="none" className="bg-primary w-2 h-2 rounded-full" />}
        </label>
      )}
      {description && (
        <p
          {...descriptionProps}
          id={ids.description}

          data-name={descriptionProps?.['data-name'] ?? 'form-field-description'}
        >
          {description}
        </p>
      )}
      {children(bag)}
      {invalid && (
        <div
          {...invalidDescriptionProps}
          id={ids.description}

          role="alert"
          aria-hidden={!invalid}
          aria-live="polite"

          data-name={invalidDescriptionProps?.['data-name'] ?? 'form-field-error'}
        >
          {invalidDescription}
        </div>
      )}
    </div>
  )
})
