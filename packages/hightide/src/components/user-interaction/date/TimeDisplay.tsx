import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { useDateTimeFormat, useLocalization } from '@/src/global-contexts/LocalizationProvider'
import { DateUtils } from '@helpwave/hightide-utils'

type TimeDisplayMode = 'daysFromToday' | 'date' | 'time'

type TimeDisplayProps = {
  date: Date,
  mode?: TimeDisplayMode,
  is24HourFormat?: boolean,
  timeZone?: string,
}

export const TimeDisplay = ({
  date,
  mode = 'daysFromToday',
  is24HourFormat: is24HourFormatOverride,
  timeZone: timeZoneOverride,
}: TimeDisplayProps) => {
  const translation = useHightideTranslation()
  const { locale } = useLocalization()
  const { is24HourFormat: contextIs24HourFormat, timeZone: contextTimeZone } = useDateTimeFormat()
  const is24HourFormat = is24HourFormatOverride ?? contextIs24HourFormat
  const timeZone = timeZoneOverride ?? contextTimeZone

  const zonedDate = DateUtils.toZonedDate(date, timeZone)
  const zonedNow = DateUtils.toZonedDate(new Date(), timeZone)
  const difference = new Date(zonedNow).setHours(0, 0, 0, 0).valueOf() - new Date(zonedDate).setHours(0, 0, 0, 0).valueOf()
  const isBefore = difference > 0
  const differenceInDays = Math.floor(Math.abs(difference) / (1000 * 3600 * 24))

  let displayString
  if (differenceInDays === 0) {
    displayString = translation('time.today')
  } else if (differenceInDays === 1) {
    displayString = isBefore ? translation('time.yesterday') : translation('time.tomorrow')
  } else {
    displayString = isBefore ? translation('time.agoDays', { days: differenceInDays }) : translation('time.inDays', { days: differenceInDays })
  }
  const monthToTranslation: { [key: number]: string } = {
    0: translation('time.january'),
    1: translation('time.february'),
    2: translation('time.march'),
    3: translation('time.april'),
    4: translation('time.may'),
    5: translation('time.june'),
    6: translation('time.july'),
    7: translation('time.august'),
    8: translation('time.september'),
    9: translation('time.october'),
    10: translation('time.november'),
    11: translation('time.december')
  } as const

  const timeString = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: is24HourFormat ? 'h23' : 'h12',
    timeZone,
  }).format(date)

  let fullString
  if (mode === 'daysFromToday') {
    fullString = `${timeString} - ${displayString}`
  } else if (mode === 'time') {
    fullString = timeString
  } else {
    fullString = `${zonedDate.getDate()}. ${monthToTranslation[zonedDate.getMonth()]} ${zonedDate.getFullYear()}`
  }

  return (<span>{fullString}</span>)
}
