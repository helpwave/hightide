import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { ArrowDown, ArrowUp, Calendar } from 'lucide-react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { LocalizationUtil } from '@helpwave/hightide-utils/i18n'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { IconButton } from '../../../interaction/IconButton'
import { TabSwitcher } from '../../../layout/TabSwitcher'
import { useCalendarDatePickerContext } from './CalendarDatePickerContext'

export type CalendarDatePickerHeaderProps = HTMLAttributes<HTMLDivElement> & {
  timeLabel?: string,
  hasTime?: boolean,
}

export const CalendarDatePickerHeader = forwardRef<HTMLDivElement, CalendarDatePickerHeaderProps>(function CalendarDatePickerHeader({
  timeLabel,
  hasTime = false,
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const { state, dispatch, config } = useCalendarDatePickerContext()
  const isDayMode = state.displayMode === 'day'
  const isLocked = config.isDisabled || config.isReadOnly
  const previousMonth = DateUtils.subtractDuration(state.displayedMonth, { months: 1 })
  const nextMonth = DateUtils.addDuration(state.displayedMonth, { months: 1 })
  const dayLabel = String(state.value.getDate())
  const monthYearLabel = `${new Intl.DateTimeFormat(LocalizationUtil.isoLocaleToLanguage(config.locale), { month: 'short' }).format(state.displayedMonth)} ${state.displayedMonth.getFullYear()}`

  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('calendar-date-picker-header', props.className)}
    >
      <div className="calendar-date-picker-selectors">
        <TabSwitcher
          variant="segmented-chips"
          activeId={state.displayMode}
          onActiveIdChange={(id) => {
            if (id === 'day' || id === 'yearMonth' || id === 'time') {
              dispatch({ type: 'setDisplayMode', displayMode: id })
            }
          }}
        >
          <TabSwitcher.TabList />
          <TabSwitcher.TabPanel id="day" label={dayLabel} disabled={isLocked} />
          <TabSwitcher.TabPanel id="yearMonth" label={monthYearLabel} disabled={isLocked} />
          {hasTime && <TabSwitcher.TabPanel id="time" label={timeLabel ?? ''} disabled={isLocked} />}
        </TabSwitcher>
      </div>
      <div className="flex-row-2 justify-end">
        <IconButton
          tooltip={translation('time.today')}
          size="sm"
          variant="tonal"
          disabled={!isDayMode || isLocked}
          onClick={() => dispatch({ type: 'today' })}
          icon={Calendar}
        />
        <IconButton
          tooltip={translation('time.previousMonth')}
          size="sm"
          disabled={!isDayMode || isLocked || !DateUtils.between(previousMonth, config.start, config.end)}
          onClick={() => dispatch({ type: 'shiftMonth', direction: -1 })}
          icon={ArrowUp}
        />
        <IconButton
          tooltip={translation('time.nextMonth')}
          size="sm"
          disabled={!isDayMode || isLocked || !DateUtils.between(nextMonth, config.start, config.end)}
          onClick={() => dispatch({ type: 'shiftMonth', direction: 1 })}
          icon={ArrowDown}
        />
      </div>
    </div>
  )
})
