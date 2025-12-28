import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import React, { cloneElement, isValidElement, useId, useMemo } from 'react'
import { clsx } from 'clsx'
import type { BagFunction } from '@/src/utils/bagFunctions'
import type { LabelProps } from '@/src/components/display-and-visualization/Label'
import { Label } from '@/src/components/display-and-visualization/Label'
import type { FormInputProps } from './useForm'

type FormElementHTMLProperties = Pick<HTMLAttributes<HTMLElement>, 'id' | 'aria-labelledby' | 'aria-describedby' | 'aria-disabled' | 'aria-readonly' | 'aria-invalid' | 'aria-errormessage' | 'aria-required'>

export type FormElementWrapperBagProps<T> = FormElementHTMLProperties & Omit<FormInputProps<T>, 'invalidDescription'> & {
  invalid: boolean,
}

export type FormElementWrapperBag<T> =  {
  props: FormElementWrapperBagProps<T>,
  required: boolean,
}

export type FormElementWrapperProps<T> = Partial<FormInputProps<T>> & {
  children: BagFunction<FormElementWrapperBag<T>> | ReactElement<Partial<FormInputProps<T>>>,
  id?: string,
  required?: boolean,
  label?: ReactNode,
  labelProps?: Omit<LabelProps, 'children'>,
  invalidDescription?: ReactNode,
  invalidDescriptionProps?: Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>,
  description?: ReactNode,
  descriptionProps?: Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>,
  containerClassName?: string,
}

export const FormElementWrapper = <T,>({
  children,
  id,
  value,
  onValueChange,
  onEditComplete,
  required = false,
  disabled = false,
  readOnly: readonly = false,
  label,
  labelProps,
  invalidDescription,
  invalidDescriptionProps,
  description,
  descriptionProps,
  containerClassName,
}: FormElementWrapperProps<T>) => {
  const generatedId = useId()
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

  const bag: FormElementWrapperBag<T> = {
    props: {
      'id': ids.input,
      disabled,
      invalid,
      'readOnly': readonly,
      value,
      onValueChange,
      onEditComplete,
      'aria-required': required,
      'aria-disabled': disabled,
      'aria-readonly': readonly,
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
          React.Children.map(children,  element => cloneElement(element, { ...bag.props }))
          : children
      }
      {invalid && (
        <p
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
        </p>
      )}
    </div>
  )
}