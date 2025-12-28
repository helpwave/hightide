import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import clsx from 'clsx'
import type { LabelProps } from '@/src/components/display-and-visualization/Label'
import { Label } from '@/src/components/display-and-visualization/Label'
import { useDelay, type UseDelayOptions } from '@/src/hooks/useDelay'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { FormElementWrapperBagProps } from '../form/FormElementWrapper'
import { DataAttributesUtil } from '@/src/utils/dataAttribute'

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> &
 Partial<FormElementWrapperBagProps<string>> & { saveDelayOptions?: UseDelayOptions }

/**
 * A Textarea component for inputting longer texts
 *
 * The State is managed by the parent
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  id,
  onValueChange,
  onEditComplete,
  saveDelayOptions,
  invalid = false,
  disabled = false,
  ...props
}, ref) {
  const { restartTimer, clearTimer } = useDelay(saveDelayOptions)

  const onEditCompleteWrapper = (text: string) => {
    onEditComplete?.(text)
    clearTimer()
  }

  return (
    <textarea
      {...props}
      ref={ref}
      id={id}
      disabled={disabled}

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

      data-name={DataAttributesUtil.name('textarea', props)}
      data-value={DataAttributesUtil.bool(!!props.value)}
      data-disabled={DataAttributesUtil.bool(disabled)}
      data-invalid={DataAttributesUtil.bool(invalid)}
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
  headlineProps: Omit<LabelProps, 'children'>,
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
        <Label size="md" {...headlineProps} htmlFor={usedId}>
          {headline}
        </Label>
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