import type { ReactNode } from 'react'
import { CalendarIcon, X } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { IconButton } from '../../../interaction/IconButton'
import { Visibility } from '../../../layout/Visibility'
import { useDateTimeInputContext } from './DateTimeInputContext'

export type DateTimeInputActionsProps = {
  actions?: ReactNode[],
  popupId: string,
}

export function DateTimeInputActions({ actions = [], popupId }: DateTimeInputActionsProps) {
  const translation = useHightideTranslation()
  const { state, dispatch, config, mode, hasClear, hasTimePicker } = useDateTimeInputContext()

  return (
    <div className="data-time-actions-container">
      {actions}
      <Visibility isVisible={hasClear}>
        <IconButton
          tooltip={translation('clearValue')}
          variant="foreground"
          color="neutral"
          size="sm"
          onClick={() => dispatch({ type: 'commit', value: null })}
          icon={X}
        />
      </Visibility>
      <Visibility isVisible={hasTimePicker}>
        <IconButton
          tooltip={translation('sDateTimeSelect', { datetimeMode: mode })}
          variant="foreground"
          color="neutral"
          size="sm"
          disabled={config.isDisabled}
          onClick={() => dispatch({ type: 'open' })}
          aria-haspopup="dialog"
          aria-expanded={state.isOpen}
          aria-controls={state.isOpen ? popupId : undefined}
          icon={CalendarIcon}
        />
      </Visibility>
    </div>
  )
}
