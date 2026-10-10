import type { LabelHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import clsx from 'clsx'
import { Textarea, type TextareaProps } from './Textarea'

export type TextareaWithHeadlineProps = TextareaProps & {
  headline: ReactNode,
  headlineProps: Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'>,
  containerClassName?: string,
  id?: string,
}

export const TextareaWithHeadline = ({
  id,
  headline,
  headlineProps,
  isDisabled = false,
  inputProps,
  containerClassName,
  ...props
}: TextareaWithHeadlineProps) => {
  const genId = useId()
  const usedId = id ?? inputProps?.id ?? genId

  return (
    <div
      className={clsx(
        'group flex-col-3 border-2 rounded-lg',
        {
          'bg-input-background text-input-text hover:border-primary focus-within:border-primary': !isDisabled,
          'border-disabled-border bg-disabled-background cursor-not-allowed': isDisabled,
        },
        containerClassName
      )}
    >
      {headline && (
        <label {...headlineProps} htmlFor={usedId} className={clsx('typography-lable-md text-label', headlineProps.className)}>
          {headline}
        </label>
      )}
      <Textarea
        {...props}
        isDisabled={isDisabled}
        inputProps={{
          ...inputProps,
          id: usedId,
          className: clsx(
            'border-transparent focus:ring-0 focus-visible:ring-0 resize-none h-32',
            inputProps?.className
          ),
        }}
      />
    </div>
  )
}
