import type { Ref } from 'react'
import { Button } from '../../../interaction/Button'
import { useTimePickerContext } from './TimePickerContext'
import type { TimePickerEvent } from './TimePickerState'

export type TimePickerTriggerProps = {
  event: TimePickerEvent,
  isSelected: boolean,
  label: string,
  selectedRef?: Ref<HTMLButtonElement>,
}

export function TimePickerTrigger({
  event,
  isSelected,
  label,
  selectedRef,
}: TimePickerTriggerProps) {
  const { dispatch, config } = useTimePickerContext()
  const isInteractive = !config.isDisabled && !config.isReadOnly

  return (
    <Button
      size="sm"
      color={isSelected ? 'primary' : 'neutral'}
      ref={isSelected ? selectedRef : undefined}
      disabled={!isInteractive}
      onClick={() => {
        if (isInteractive) {
          dispatch(event)
        }
      }}
      className="min-w-16"
    >
      {label}
    </Button>
  )
}
