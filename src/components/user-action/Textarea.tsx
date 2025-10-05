import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import clsx from 'clsx'
import type { LabelProps } from '@/src/components/user-action/Label'
import { Label } from '@/src/components/user-action/Label'
import { useDelay, type UseDelayOptions } from '@/src/hooks/useDelay'
import { noop } from '@/src/utils/noop'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> & {
  /** Inside the area */
  value?: string,
  invalid?: boolean,
  onChangeText?: (text: string) => void,
  onEditCompleted?: (text: string) => void,
  saveDelayOptions?: UseDelayOptions,
  defaultStyle?: boolean,
}

/**
 * A Textarea component for inputting longer texts
 *
 * The State is managed by the parent
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
                                                                                           id,
                                                                                           onChange,
                                                                                           onChangeText,
                                                                                           onBlur,
                                                                                           onEditCompleted,
                                                                                           saveDelayOptions,
                                                                                           defaultStyle = true,
                                                                                           invalid = false,
                                                                                           disabled = false,
                                                                                           className,
                                                                                           ...props
                                                                                         }, ref) {
  const { restartTimer, clearTimer } = useDelay(saveDelayOptions)

  const onEditCompletedWrapper = (text: string) => {
    onEditCompleted?.(text)
    clearTimer()
  }

  return (
    <textarea
      ref={ref}
      id={id}
      className={clsx(
        'resize-none w-full h-32 overflow-y-scroll',
        'py-2 px-3 rounded-md border-2 border-transparent focus-style-none',
        {
          'bg-input-background text-input-text hover:border-primary focus:border-primary': !disabled && !invalid,
          'bg-negative/20 text-negative hover:border-negative focus-visible:border-negative': invalid && !disabled && defaultStyle,
          'text-disabled bg-disabled-background border-disabled-border': disabled && defaultStyle,
        },
        className
      )}
      onChange={(event) => {
        const value = event.target.value
        restartTimer(() => {
          onEditCompletedWrapper(value)
        })
        onChange?.(event)
        onChangeText?.(value)
      }}
      onBlur={(event) => {
        onBlur?.(event)
        onEditCompletedWrapper(event.target.value)
      }}
      disabled={disabled}
      {...props}
    />
  )
})

/**
 * A Textarea component that is not controlled by its parent
 */
export const TextareaUncontrolled = ({
                                       value,
                                       onChangeText = noop,
                                       ...props
                                     }: TextareaProps) => {
  const [text, setText] = useOverwritableState<string>(value, onChangeText)

  return (
    <Textarea
      {...props}
      value={text}
      onChangeText={setText}
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
        defaultStyle={false}
      />
    </div>
  )
}