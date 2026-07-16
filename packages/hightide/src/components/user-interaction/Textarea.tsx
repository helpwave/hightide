import type { LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { forwardRef, useCallback, useId } from 'react'
import clsx from 'clsx'
import { useDelay, type UseDelayOptions } from '@/src/hooks/useDelay'
import type { FormFieldInteractionStates } from '../form/FieldLayout'
import type { FormFieldDataHandling } from '../form/FormField'
import { PropsUtil } from '@/src/utils/propsUtil'
import { useControlledState } from '@/src/hooks/useControlledState'
import { useEventCallbackStabilizer } from '@/src/hooks/useEventCallbackStabelizer'

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'>
  & Partial<FormFieldDataHandling<string>>
  & Partial<FormFieldInteractionStates>
  & {
    initialValue?: string,
    saveDelayOptions?: UseDelayOptions,
}

/**
 * A Textarea component for inputting longer texts
 *
 * The State is managed by the parent
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  value: controlledValue,
  initialValue,
  invalid = false,
  onValueChange,
  onEditComplete,
  saveDelayOptions,
  ...props
}, ref) {
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onValueChange,
    defaultValue: initialValue,
  })
  const { restartTimer, clearTimer } = useDelay(saveDelayOptions)

  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)
  const onEditCompleteWrapper = useCallback((text: string) => {
    onEditCompleteStable(text)
    clearTimer()
  }, [onEditCompleteStable, clearTimer])

  return (
    <textarea
      {...props}
      ref={ref}
      value={value}

      onChange={(event) => {
        const value = event.target.value
        restartTimer(() => {
          onEditCompleteWrapper(value)
        })
        props.onChange?.(event)
        setValue(value)
      }}
      onBlur={(event) => {
        props.onBlur?.(event)
        onEditCompleteWrapper(event.target.value)
      }}

      data-name={props['data-name'] ?? 'textarea'}
      data-value={PropsUtil.dataAttributes.bool(!!value)}
      {...PropsUtil.dataAttributes.interactionStates({ ...props, invalid })}

      {...PropsUtil.aria.interactionStates({ ...props, invalid }, props)}
    />
  )
})


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