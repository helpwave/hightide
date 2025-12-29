import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import React, { cloneElement, isValidElement, useId, useMemo } from 'react'
import { clsx } from 'clsx'
import type { BagFunction } from '@/src/utils/bagFunctions'
import type { LabelProps } from '@/src/components/display-and-visualization/Label'
import { Label } from '@/src/components/display-and-visualization/Label'
import { useFormContext, useFormField } from './FormContext'
import type { FormValue } from './FormStore'

type FormFieldHTMLProperties = Pick<HTMLAttributes<HTMLElement>, 'id' | 'aria-labelledby' | 'aria-describedby' | 'aria-disabled' | 'aria-readonly' | 'aria-invalid' | 'aria-errormessage' | 'aria-required'>

export type FormFieldProps<T> = {
  value: T,
  onValueChange: (value: T) => void,
  onEditComplete: (value: T) => void,
  invalid: boolean,
  disabled: boolean,
  readOnly: boolean,
} & FormFieldHTMLProperties

export type FormFieldWrapperBag<T> =  {
  props: FormFieldProps<T>,
  required: boolean,
}

export type FormFieldWrapperProps<T extends FormValue> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: BagFunction<FormFieldWrapperBag<T[keyof T]>> | (ReactElement<FormFieldProps<T[keyof T]> & React.RefAttributes<any>>),
  id?: string,
  name: keyof T,
  required?: boolean,
  label?: ReactNode,
  labelProps?: Omit<LabelProps, 'children'>,
  invalidDescriptionProps?: Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>,
  description?: ReactNode,
  descriptionProps?: Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>,
  containerClassName?: string,
}

export const FormFieldWrapper = <T extends FormValue>({
  children,
  id,
  name,
  required = false,
  label,
  labelProps,
  invalidDescriptionProps,
  description,
  descriptionProps,
  containerClassName,
}: FormFieldWrapperProps<T>) => {
  const generatedId = useId()
  const { registerRef } = useFormContext<T>()
  const { invalidDescription, ...props } = useFormField<T, keyof T>(name)

  const ids = useMemo(() => ({
    input: id ?? generatedId,
    error: `form-element-error-${generatedId}`,
    label: `form-element-label-${generatedId}`,
    description: `form-element-description-${generatedId}`
  }), [generatedId, id])

  const describedBy: string = [
    description ? ids.description : undefined,
    invalidDescription ? ids.error : undefined,
  ].filter(Boolean).join(' ')

  const labelledBy = label ? ids.label : undefined

  const invalid = !!invalidDescription

  const bag: FormFieldWrapperBag<T[keyof T]> = {
    props: {
      ...props,
      'id': ids.input,
      invalid,
      'aria-required': required,
      'aria-describedby': describedBy,
      'aria-labelledby': labelledBy,
      'aria-invalid': invalid,
      'aria-errormessage': invalid ? ids.error : undefined,
    },
    required,
  }

  return (
    <div className={clsx('relative flex flex-col gap-y-1', containerClassName)}>
      {label && (
        <Label
          {...labelProps}
          id={ids.label}
          htmlFor={ids.input}
          size="lg"
          className={clsx('flex-row-1 items-start', labelProps?.className)}
        >
          {label}
          {required && <div role="none" className="bg-primary w-2 h-2 rounded-full"/>}
        </Label>
      )}
      {description && (
        <p
          {...descriptionProps}
          id={ids.description}
          className={clsx('text-description text-sm', descriptionProps?.className)}
        >
          {description}
        </p>
      )}
      {typeof children === 'function'
        ? children(bag)
        : isValidElement(children) ?
          React.Children.map(children, element => cloneElement(element, { ...bag.props, ref: registerRef(name) }))
          : children
      }
      {invalid && (
        <div
          {...invalidDescriptionProps}
          id={ids.description}

          role="alert"
          aria-hidden={!invalid}
          aria-live="polite"

          className={clsx(
            'absolute top-[calc(100%_+_0.25rem)] left-0 text-negative text-sm font-medium',
            invalidDescriptionProps?.className
          )}
        >
          {invalidDescription}
        </div>
      )}
    </div>
  )
}
