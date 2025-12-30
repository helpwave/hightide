import type { LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import clsx from 'clsx'
import { useDelay, type UseDelayOptions } from '@/src/hooks/useDelay'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { FormFieldInteractionStates } from '../form/FieldLayout'
import type { FormFieldDataHandling } from '../form/FormField'
import { PropsUtil } from '@/src/utils/propsUtil'

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'>
  & Partial<FormFieldDataHandling<string>>
  & Partial<FormFieldInteractionStates>
  & { saveDelayOptions?: UseDelayOptions }

/**
 * A Textarea component for inputting longer texts
 *
 * The State is managed by the parent
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  invalid = false,
  onValueChange,
  onEditComplete,
  saveDelayOptions,
  ...props
}, ref) {
  const { restartTimer, clearTimer } = useDelay(saveDelayOptions)

  const onEditCompleteWrapper = (text: string) => {
    onEditComplete?.(text)
    clearTimer()
  }

  console.log('build text')

  return (
    <textarea
      {...props}
      ref={ref}

      onChange={(event) => {
        const value = event.target.value
        restartTimer(() => {
          onEditCompleteWrapper(value)
        })
        props.onChange?.(event)
        onValueChange?.(value)
      }}
      onBlur={(event) => {
        props.onBlur?.(event)
        onEditCompleteWrapper(event.target.value)
      }}

      data-name={PropsUtil.dataAttributes.name('textarea', props)}
      data-value={PropsUtil.dataAttributes.bool(!!props.value)}
      {...PropsUtil.dataAttributes.interactionStates({ ...props, invalid })}

      {...PropsUtil.aria.interactionStates({ ...props, invalid }, props)}
    />
  )
})

/**
 * A Textarea component that is not controlled by its parent
 */
export const TextareaUncontrolled = ({
  value: initialValue,
  onValueChange,
  ...props
}: TextareaProps) => {
  const [value, setValue] = useOverwritableState<string>(initialValue, onValueChange)

  return (
    <Textarea
      {...props}
      value={value}
      onValueChange={setValue}
    />
  )
}

export type TextareaWithHeadlineProps = Omit<TextareaProps, 'defaultStyle'> & {
  headline: ReactNode,
  headlineProps: Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'>,
  containerClassName?: string,
}

export const TextareaWithHeadline = ({
  id,
  headline,
  headlineProps,
  disabled,
  className,
  containerClassName,
  ...props
}: TextareaWithHeadlineProps) => {
  const genId = useId()
  const usedId = id ?? genId

  return (
    <div
      className={clsx(
        'group flex-col-3 border-2 rounded-lg',
        {
          'bg-input-background text-input-text hover:border-primary focus-within:border-primary': !disabled,
          'border-disabled-border bg-disabled-background cursor-not-allowed': disabled,
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
        id={usedId}
        className={clsx(
          'border-transparent focus:ring-0 focus-visible:ring-0 resize-none h-32',
          className
        )}
      />
    </div>
  )
}