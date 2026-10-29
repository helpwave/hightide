import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import { Children, forwardRef } from 'react'
import { PropsUtil } from '../../../../utils/propsUtil'
import { useNumberStepperInputContext } from './NumberStepperInputContext'

export type NumberStepperInputLayoutMode = 'row' | 'col'

export type NumberStepperInputLayoutProps = HTMLAttributes<HTMLDivElement> & {
  layout?: NumberStepperInputLayoutMode,
}

export const NumberStepperInputLayout = forwardRef<HTMLDivElement, NumberStepperInputLayoutProps>(function NumberStepperInputLayout({
  layout = 'row',
  children,
  ...props
}, forwardedRef) {
  const { config } = useNumberStepperInputContext()
  const [decrement, field, increment] = Children.toArray(children)
  const ordered: ReactNode[] = layout === 'col'
    ? [increment, field, decrement]
    : [decrement, field, increment]

  return (
    <div
      {...props}
      ref={forwardedRef}
      data-layout={layout}
      data-disabled={PropsUtil.dataAttributes.bool(config.isDisabled)}
      data-readonly={PropsUtil.dataAttributes.bool(config.isReadOnly)}
      className={clsx('number-stepper-input', props.className)}
    >
      {ordered}
    </div>
  )
})
