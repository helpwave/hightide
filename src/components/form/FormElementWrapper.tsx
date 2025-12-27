import type { HTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import { clsx } from 'clsx'
import type { BagFunction } from '@/src/utils/bagFunctions'
import type { LabelProps } from '@/src/components/display-and-visualization/Label'
import { Label } from '@/src/components/display-and-visualization/Label'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

type ErrorShowBehaviour = 'always' | 'whenTouched'

type FormElementHTMLProperties = Pick<HTMLAttributes<HTMLElement>, 'id' | 'aria-labelledby' | 'aria-describedby' | 'aria-disabled' | 'aria-invalid' | 'aria-errormessage' | 'aria-required'>

export type FormElementStateProperties = {
  invalid: boolean,
  disabled: boolean,
}

type FormElementWrapperBag = FormElementHTMLProperties & FormElementStateProperties & {
  required: boolean,
  isShowingError: boolean,
  setIsShowingError: (isShowingError?: boolean) => void,
}

export type FormElementWrapperProps = {
  children: BagFunction<FormElementWrapperBag>,
  id?: string,
  required?: boolean,
  disabled?: boolean,
  isShowingError?: boolean,
  onIsShowingError?: (isTouched: boolean) => void,
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
  isShowingError: initialIsShowingError = false,
  onIsShowingError,
  label,
  labelProps,
  errorShowBehaviour = 'whenTouched',
  error,
  errorProps,
  description,
  descriptionProps,
  containerClassName,
}: FormElementWrapperProps) => {
  const [touched, setTouched] = useOverwritableState(initialIsShowingError, onIsShowingError)
  const generatedId = useId()
  const usedId = id ?? generatedId

  const errorId = `${usedId}-description`
  const labelId = `${usedId}-label`
  const descriptionId = `${usedId}-description`

  const describedBy: string = [
    description ? descriptionId : undefined,
    error ? errorId : undefined,
  ].filter(Boolean).join(' ')

  const labelledBy = label ? `${usedId}-label` : undefined

  const isShowingError = errorShowBehaviour === 'always' || (touched)

  const bag: FormElementWrapperBag = {
    'isShowingError': touched,
    'setIsShowingError': (isTouched) => {
      const newValue = isTouched ?? true
      setTouched(newValue)
      onIsShowingError?.(isTouched)
    },
    'disabled': disabled,
    'invalid': !!error && isShowingError,
    'required': required,
    'id': usedId,
    'aria-required': required,
    'aria-disabled': disabled,
    'aria-describedby': describedBy,
    'aria-labelledby': labelledBy,
    'aria-invalid': !!error,
    'aria-errormessage': error ? errorId : undefined,
  }

  return (
    <div className={clsx('relative flex flex-col gap-y-1', containerClassName)}>
      {label && (
        <Label
          {...labelProps}
          id={labelId}
          htmlFor={usedId}
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
          id={descriptionId}
          className={clsx('text-description text-sm', descriptionProps?.className)}
        >
          {description}
        </p>
      )}
      {children(bag)}
      {error && isShowingError && (
        <p
          {...errorProps}
          id={errorId}
          className={clsx('absolute top-[calc(100%_+_0.25rem)] left-0 text-negative text-sm font-medium', errorProps?.className)}
          role="alert"
          aria-hidden={!error}
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}