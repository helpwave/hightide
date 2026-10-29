import clsx from 'clsx'
import type { RefObject } from 'react'
import { DateUtils, type Weekday } from '@helpwave/hightide-utils/utils'
import type {
  TimePickerMillisecondIncrement,
  TimePickerMinuteIncrement,
  TimePickerSecondIncrement
} from '../TimePicker'
import { DateTimePickerDialog, type DateTimePickerDialogProps } from '../DateTimePickerDialog'
import { PopUp } from '../../../layout/PopUp/PopUp'
import { useDateTimeInputContext } from './DateTimeInputContext'

export type DateTimeInputPopupProps = {
  popupId: string,
  labelId: string,
  anchor: RefObject<HTMLDivElement | null>,
  outsideClickCloses?: boolean,
  allowRemove?: boolean,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  pickerProps?: Omit<DateTimePickerDialogProps, 'value' | 'onValueChange' | 'onStateEvent' | 'mode' | 'precision' | 'is24HourFormat'>,
}

export function DateTimeInputPopup({
  popupId,
  labelId,
  anchor,
  outsideClickCloses = true,
  allowRemove = false,
  start,
  end,
  weekStart,
  markToday,
  minuteIncrement,
  secondIncrement,
  millisecondIncrement,
  pickerProps,
}: DateTimeInputPopupProps) {
  const { state, dispatch, mode, precision, timeZone, is24HourFormat } = useDateTimeInputContext()
  const toZoned = (date: Date | null) => DateUtils.toZonedDate(date, timeZone)
  const fromZoned = (date: Date | null) => DateUtils.fromZonedDate(date, timeZone)

  return (
    <PopUp
      id={popupId}
      isOpen={state.isOpen}
      anchor={anchor}
      options={{
        verticalAlignment: 'afterEnd',
        horizontalAlignment: 'center',
        gap: 4,
      }}
      outsideClickOptions={{ refs: [anchor], active: outsideClickCloses }}
      onClose={() => dispatch({ type: 'commit', value: state.value })}
      role="dialog"
      aria-labelledby={labelId}
      data-mode={mode}
      data-time-format={is24HourFormat ? '24h' : '12h'}
      className="date-time-input-dialog-popup"
    >
      <DateTimePickerDialog
        {...pickerProps}
        value={toZoned(state.dialogValue)}
        allowRemove={allowRemove}
        onStateEvent={(event) => {
          if (event.type !== 'commit') return
          dispatch({ type: 'commit', value: fromZoned(event.value) })
        }}
        layoutProps={{
          ...pickerProps?.layoutProps,
          className: clsx('date-time-input-dialog', pickerProps?.layoutProps?.className),
        }}
        bodyProps={{
          ...pickerProps?.bodyProps,
          className: clsx('date-time-input-date-time-picker', pickerProps?.layoutProps?.className, pickerProps?.bodyProps?.className),
        }}
        mode={mode}
        start={toZoned(start ?? null) ?? undefined}
        end={toZoned(end ?? null) ?? undefined}
        weekStart={weekStart}
        markToday={markToday}
        is24HourFormat={is24HourFormat}
        minuteIncrement={minuteIncrement}
        secondIncrement={secondIncrement}
        millisecondIncrement={millisecondIncrement}
        precision={precision}
      />
    </PopUp>
  )
}
