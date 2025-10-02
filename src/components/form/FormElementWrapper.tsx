import type { HTMLAttributes, ReactNode } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useId } from 'react'
import { clsx } from 'clsx'
import type { BagFunction } from '@/src/utils/bagFunctions'
import type { LabelProps } from '@/src/components/user-action/Label'
import { Label } from '@/src/components/user-action/Label'

type ErrorShowBehaviour = 'always' | 'whenTouched'

type FormElementWrapperBag = {
  'touched': boolean,
  'onTouched': (isTouched?: boolean) => void,
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
  required?: boolean,
  disabled?: boolean,
  isTouched?: boolean,
  label?: ReactNode,
  labelProps?: Omit<LabelProps, 'children'>,
  errorShowBehaviour?: ErrorShowBehaviour,
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
                                     isTouched: initialIsTouched = false,
                                     label,
                                     labelProps,
                                     errorShowBehaviour = 'whenTouched',
                                     error,
                                     errorProps,
                                     description,
                                     descriptionProps,
                                     containerClassName,
                                   }: FormElementWrapperProps) => {
  const [touched, setTouched] = useState(initialIsTouched)
  const generatedId = useId()
  const usedId = id ?? generatedId

  useEffect(() => {
    setTouched(initialIsTouched)
  }, [initialIsTouched])

  const describedBy: string = [
    description ? `${usedId}-description` : undefined,
    error ? `${usedId}-error` : undefined,
  ].filter(Boolean).join(' ')

  const labeledBy = label ? `${usedId}-label` : undefined

  const isShowingError = errorShowBehaviour === 'always' || (touched)

  const bag: FormElementWrapperBag = {
    'touched': touched,
    'onTouched': (isTouched) => setTouched(isTouched ?? true),
    'disabled': disabled,
    'invalid': !!error && isShowingError,
    'required': required,
    'id': usedId,
    'aria-describedby': describedBy,
    'aria-labelby': labeledBy
  }

  return (
    <div className={clsx('relative flex flex-col gap-y-1', containerClassName)}>
      {label && (
        <Label htmlFor={usedId} size="lg" className={clsx('flex-row-1 items-start', labelProps?.className)}>
          {label}
          {required && <div role="none" className="bg-primary w-2 h-2 rounded-full"/>}
        </Label>
      )}
      {description && (
        <p {...descriptionProps} className={clsx('text-description text-sm', descriptionProps?.className)}>
          {description}
        </p>
      )}
      {children(bag)}
      {error && isShowingError && (
        <p {...errorProps} role="alert" className={clsx('absolute top-[calc(100%_+_0.25rem)] left-0 text-negative text-sm font-medium', errorProps)}>
          {error}
        </p>
      )}
    </div>
  )
}