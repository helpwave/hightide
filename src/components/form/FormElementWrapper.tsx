import type { HTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import { clsx } from 'clsx'
import type { BagFunction } from '@/src/utils/bagFunctions'
import type { LabelProps } from '@/src/components/user-action/Label'
import { Label } from '@/src/components/user-action/Label'

type FormElementWrapperBag = {
  'invalid': boolean,
  'required': boolean,
  'disabled': boolean,
  'aria-describedby': string,
  'aria-labelby': string,
  'id': string,
}

export type FormElementWrapperProps = {
  children: BagFunction<FormElementWrapperBag>,
  id?: string,
  required: boolean,
  disabled: boolean,
  label?: ReactNode,
  labelProps?: Omit<LabelProps, 'children'>,
  error?: ReactNode,
  errorProps?: Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>,
  description?: ReactNode,
  descriptionProps?: Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>,
  containerClassName?: string,
}

export const FormElementWrapper = ({
                                     children,
                                     id,
                                     required = false,
                                     disabled = false,
                                     label,
                                     labelProps,
                                     error,
                                     errorProps,
                                     description,
                                     descriptionProps,
                                     containerClassName,
                                   }: FormElementWrapperProps) => {
  const generatedId = useId()
  const usedId = id ?? generatedId

  const describedBy: string = [
    description ? `${usedId}-description` : undefined,
    error ? `${usedId}-error` : undefined,
  ].filter(Boolean).join(' ')

  const labeledBy = label ? `${usedId}-label` : undefined

  const bag: FormElementWrapperBag = {
    'disabled': disabled,
    'invalid': !!error,
    'required': required,
    'id': usedId,
    'aria-describedby': describedBy,
    'aria-labelby': labeledBy
  }

  return (
    <div className={clsx('flex flex-col gap-y-1', containerClassName)}>
      {label && (
        <Label htmlFor={usedId} className={clsx('typography-label-md', labelProps?.className)}>
          {label}
          {required && <span role="none" className="text-primary font-bold">*</span>}
        </Label>
      )}
      {description && (
        <p {...descriptionProps} className={clsx('text-description text-xs', descriptionProps?.className)}>
          {description}
        </p>
      )}
      {children(bag)}
      {error && (
        <p {...errorProps} role="alert" className={clsx('text-negative text-sm font-medium', errorProps)}>
          {error}
        </p>
      )}
    </div>
  )
}