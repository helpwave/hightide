import type { ReactNode } from 'react'
import { useId } from 'react'
import { forwardRef, useState } from 'react'
import clsx from 'clsx'
import type { InputProps } from '@/src/components/user-interaction/input/Input'
import { Input } from '@/src/components/user-interaction/input/Input'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

type InsideLabelInputProps = Omit<InputProps, 'aria-label' | 'aria-labelledby' | 'placeholder'> & {
  label: ReactNode,
}

/**
 * Text input component with a label inside the input that moves up when editing
 *
 * The State is managed by the parent
 */
export const InsideLabelInput = forwardRef<HTMLInputElement, InsideLabelInputProps>(function InsideLabelInput({
  id: customId,
  label,
  ...props
}, forwardedRef) {
  const { value } = props
  const [isFocused, setIsFocused] = useState(false)
  const generatedId = useId()
  const id = customId ?? generatedId

  return (
    <div className={clsx('relative')}>
      <Input
        {...props}
        id={id}
        className={clsx('h-14 px-4 pb-2 py-6.5', props.className)}
        ref={forwardedRef}
        aria-labelledby={id+ '-label'}
        onFocus={event => {
          props.onFocus?.(event)
          setIsFocused(true)
        }}
        onBlur={event => {
          props.onBlur?.(event)
          setIsFocused(false)
        }}
      />
      <label
        id={id+ '-label'}
        aria-hidden={true}
        data-display={isFocused || !!value ? 'small' : 'full'}
        className={clsx(
          // margin left to account for the border which is ignored for absolute positions
          'absolute left-4 ml-0.5 top-2 transition-all delay-25 pointer-events-none touch-none',
          'data-[display=small]:top-2 data-[display=small]:h-force-4.5 data-[display=small]:typography-caption-sm data-[display=small]:overflow-y-hidden',
          'data-[display=full]:top-1/2 data-[display=full]:-translate-y-1/2 data-[display=full]:typography-body-md'
        )}
      >
        {label}
      </label>
    </div>
  )
})

export const InsideLabelInputUncontrolled = ({
  value: initialValue,
  ...props
}: InsideLabelInputProps) => {
  const [value, setValue] = useOverwritableState(initialValue, props.onChangeText)

  return (
    <InsideLabelInput
      {...props}
      value={value}
      onChangeText={setValue}
    />
  )
}
