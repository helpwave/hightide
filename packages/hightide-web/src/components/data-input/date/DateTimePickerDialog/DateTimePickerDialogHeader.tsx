import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { Trash } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Visibility } from '../../../layout/Visibility'
import { IconButton } from '../../../interaction/IconButton'
import { useDateTimePickerDialogContext } from './DateTimePickerDialogContext'

export type DateTimePickerDialogHeaderProps = HTMLAttributes<HTMLDivElement>

export const DateTimePickerDialogHeader = forwardRef<HTMLDivElement, DateTimePickerDialogHeaderProps>(function DateTimePickerDialogHeader(
  props,
  forwardedRef
) {
  const translation = useHightideTranslation()
  const { state, dispatch, config } = useDateTimePickerDialogContext()

  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('date-time-picker-dialog-header', props.className)}
    >
      <span id={config.labelId} className="date-time-picker-dialog-label">
        {config.label ?? translation('sDateTimeSelect', { datetimeMode: config.mode })}
      </span>
      <Visibility isVisible={config.allowRemove && !!state.value}>
        <IconButton
          className="date-time-picker-dialog-clear"
          tooltip={translation('clear')}
          variant="foreground"
          size="sm"
          icon={Trash}
          onClick={() => dispatch({ type: 'commit', value: null })}
        />
      </Visibility>
    </div>
  )
})
