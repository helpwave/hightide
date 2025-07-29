import type { ReactNode } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import type { InputProps } from '@/src'
import { Input } from '@/src'

type InsideLabelInputProps = Omit<InputProps, 'aria-label' | 'aria-labelledby' | 'placeholder'> & {
  label: ReactNode,
}

/**
 * Text input component with a label inside the input that moves up when editing
 *
 * The State is managed by the parent
 */
export const InsideLabelInput = forwardRef<HTMLInputElement, InsideLabelInputProps>(function InsideLabelInput({
                                                                                                                label,
                                                                                                                ...props
                                                                                                              }, forwardedRef) {
  const { value } = props

  return (
    <div className={clsx('relative')}>
      <Input
        {...props}
        className={clsx('h-15 px-4 pb-2 py-6.5', props.className)}
        ref={forwardedRef}
      />
      <div
        aria-hidden={true}
        data-display={value ? 'small' : 'full'}
        className={clsx(
          'absolute left-4 top-2',
          'data-[display=small]:top-2 h-force-4.5 overflow-y-hidden',
          'data-[display=full]:top-1/2 data-[display=full]:-translate-y-1/2'
        )}
      >
        {label}
      </div>
    </div>
  )
})

export const InsideLabelInputUncontrolled = ({
                                              value: initialValue,
                                              ...props
                                            }: InsideLabelInputProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <InsideLabelInput
      value={value}
      onChangeText={text => {
        props.onChangeText?.(text)
        setValue(text)
      }}
      {...props}
    />
  )
}
