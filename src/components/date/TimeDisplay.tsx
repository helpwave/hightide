import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { TimeTranslationType } from '../../localization/defaults/time'
import { timeTranslation } from '../../localization/defaults/time'

type TimeDisplayTranslationType = TimeTranslationType & {
  inDays: string,
  agoDays: string,
}

const defaultTimeDisplayTranslations: Translation<TimeDisplayTranslationType> = {
  en: {
    ...timeTranslation.en,
    inDays: `in {{days}} days`,
    agoDays: `{{days}} days ago`,
  },
  de: {
    ...timeTranslation.de,
    inDays: `in {{days}} Tagen`,
    agoDays: `vor {{days}} Tagen`,
  }
}

type TimeDisplayMode = 'daysFromToday' | 'date'

type TimeDisplayProps = {
  date: Date,
  mode?: TimeDisplayMode,
}

/**
 * A Component for displaying time and dates in a unified fashion
 */
export const TimeDisplay = ({
                              overwriteTranslation,
                              date,
                              mode = 'daysFromToday'
                            }: PropsForTranslation<TimeDisplayTranslationType, TimeDisplayProps>) => {
  const translation = useTranslation([defaultTimeDisplayTranslations], overwriteTranslation)
  const difference = new Date().setHours(0, 0, 0, 0).valueOf() - new Date(date).setHours(0, 0, 0, 0).valueOf()
  const isBefore = difference > 0
  const differenceInDays = Math.floor(Math.abs(difference) / (1000 * 3600 * 24))

  let displayString
  if (differenceInDays === 0) {
    displayString = translation('today')
  } else if (differenceInDays === 1) {
    displayString = isBefore ? translation('yesterday') : translation('tomorrow')
  } else {
    displayString = isBefore ? translation('agoDays', { replacements: { days: differenceInDays.toString() } }) : translation('inDays', { replacements: { days: differenceInDays.toString() } })
  }
  const monthToTranslation: { [key: number]: string } = {
    0: translation('january'),
    1: translation('february'),
    2: translation('march'),
    3: translation('april'),
    4: translation('may'),
    5: translation('june'),
    6: translation('july'),
    7: translation('august'),
    8: translation('september'),
    9: translation('october'),
    10: translation('november'),
    11: translation('december')
  } as const

  let fullString
  if (mode === 'daysFromToday') {
    fullString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} - ${displayString}`
  } else {
    fullString = `${date.getDate()}. ${monthToTranslation[date.getMonth()]} ${date.getFullYear()}`
  }

  return (
    <span>
      {fullString}
    </span>
  )
}
