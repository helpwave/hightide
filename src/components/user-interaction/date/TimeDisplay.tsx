import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

type TimeDisplayMode = 'daysFromToday' | 'date'

type TimeDisplayProps = {
  date: Date,
  mode?: TimeDisplayMode,
}

/**
 * A Component for displaying time and dates in a unified fashion
 */
export const TimeDisplay = ({
  date,
  mode = 'daysFromToday'
}: TimeDisplayProps) => {
  const translation = useHightideTranslation()
  const difference = new Date().setHours(0, 0, 0, 0).valueOf() - new Date(date).setHours(0, 0, 0, 0).valueOf()
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

  let fullString
  if (mode === 'daysFromToday') {
    fullString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} - ${displayString}`
  } else {
    fullString = `${date.getDate()}. ${monthToTranslation[date.getMonth()]} ${date.getFullYear()}`
  }

  return (<span>{fullString}</span>)
}
