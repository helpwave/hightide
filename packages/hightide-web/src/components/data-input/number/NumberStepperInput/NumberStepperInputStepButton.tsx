import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { Minus, Plus } from 'lucide-react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { IconButton } from '../../../interaction/IconButton'
import { useNumberStepperInputContext } from './NumberStepperInputContext'
import type { NumberStepperInputLayoutMode } from './NumberStepperInputLayout'

export type NumberStepperInputStepButtonProps = Omit<ComponentProps<typeof IconButton>, 'icon' | 'onClick'> & {
  direction: -1 | 1,
  layout?: NumberStepperInputLayoutMode,
}

export const NumberStepperInputStepButton = forwardRef<HTMLButtonElement, NumberStepperInputStepButtonProps>(function NumberStepperInputStepButton({
  direction,
  layout = 'row',
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const { config, startScroll, stopScroll } = useNumberStepperInputContext()
  const isIncrement = direction === 1

  return (
    <IconButton
      {...props}
      ref={forwardedRef}
      type="button"
      size="sm"
      color="neutral"
      variant="tonal"
      disabled={config.isDisabled || config.isReadOnly}
      tooltip={translation(isIncrement ? 'increaseValue' : 'decreaseValue')}
      tooltipProps={{
        alignment: isIncrement && layout === 'col' ? 'top' : 'bottom',
        options: { avoidOverlap: false },
      }}
      data-layout={layout === 'col' ? 'col' : 'row'}
      icon={isIncrement ? Plus : Minus}
      onPointerDown={() => startScroll('button', direction)}
      onPointerUp={() => stopScroll('button', direction)}
      onPointerLeave={() => stopScroll('button', direction)}
      onPointerCancel={() => stopScroll('button', direction)}
      className={clsx('number-stepper-input-button', props.className)}
    />
  )
})

export const NumberStepperInputDecrement = forwardRef<HTMLButtonElement, Omit<NumberStepperInputStepButtonProps, 'direction'>>(function NumberStepperInputDecrement(
  props,
  forwardedRef
) {
  return (
    <NumberStepperInputStepButton
      {...props}
      ref={forwardedRef}
      direction={-1}
    />
  )
})

export const NumberStepperInputIncrement = forwardRef<HTMLButtonElement, Omit<NumberStepperInputStepButtonProps, 'direction'>>(function NumberStepperInputIncrement(
  props,
  forwardedRef
) {
  return (
    <NumberStepperInputStepButton
      {...props}
      ref={forwardedRef}
      direction={1}
    />
  )
})
