import type { LabelHTMLAttributes, ReactNode, RefObject } from 'react'
import { useId } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import type { TextInputProps } from './TextInput'
import { TextInput } from './TextInput'

type InsideLabelInputProps = TextInputProps
  & {
    id: string,
    label: ReactNode,
    lablerRef?: RefObject<HTMLLabelElement>,
    labelProps?: LabelHTMLAttributes<HTMLLabelElement>,
  }

/**
 * Text input component with a label inside the input that moves up when editing
 *
 * The State is managed by the parent
 */
export const InsideLabelInput = ({
  id: customId,
  inputRef,
  inputProps,
  label,
  lablerRef,
  labelProps,
  ...props
}: InsideLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const generatedId = useId()
  const id = customId ?? generatedId
  const labelId = id + '-label'

  return (
    <div className={clsx('relative')}>
      <TextInput.StateManager {...props}>
        <TextInput.Input
          {...inputProps ?? {}}
          ref={inputRef}
          id={id}
          onFocus={event => {
            inputProps?.onFocus?.(event)
            setIsFocused(true)
          }}
          onBlur={event => {
            inputProps?.onBlur?.(event)
            setIsFocused(false)
          }}
          aria-labelledby={labelId}
          className={clsx('h-14 px-4 pb-2 py-6.5', inputProps?.className)}
        />
        <TextInput.Consumer>
          {(context) => {
            if(!context) return
            return (
              <label
                ref={lablerRef}
                {...labelProps ?? {}}
                id={labelId}
                aria-hidden={true}
                data-display={isFocused || !!context.state.value ? 'small' : 'full'}
                className={clsx(
                  'absolute left-4 ml-0.5 top-2 transition-all delay-25 pointer-events-none touch-none',
                  'data-[display=small]:top-2 data-[display=small]:h-force-4.5 data-[display=small]:typography-caption-sm data-[display=small]:overflow-y-hidden',
                  'data-[display=full]:top-1/2 data-[display=full]:-translate-y-1/2 data-[display=full]:typography-body-md',
                  labelProps?.className
                )}
              >
                {label}
              </label>
            )
          }}
        </TextInput.Consumer>
      </TextInput.StateManager>
    </div>
  )
}
