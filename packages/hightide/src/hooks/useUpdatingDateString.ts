import { useEffect, useState } from 'react'
import { DateUtils, type DateTimeFormat } from '@helpwave/hightide-utils/utils'
import type { HightideTranslationLocales } from '@helpwave/hightide-utils/i18n'
import { useLocalization } from '../global-contexts/localization/forward-exports'

export interface UseUpdatingDateStringProps {
  date: Date,
  absoluteFormat?: DateTimeFormat,
  localeOverride?: HightideTranslationLocales,
  is24HourFormat?: boolean,
  timeZone?: string,
}

type DateAndTimeStrings = {
  compareDate: Date,
  absolute: string,
  relative: string,
}

export const useUpdatingDateString = ({ absoluteFormat = 'dateTime', localeOverride, is24HourFormat: is24HourFormatOverride, timeZone: timeZoneOverride, date }: UseUpdatingDateStringProps) => {
  const { locale: contextLocale, is24HourFormat: contextIs24HourFormat, timeZone: contextTimeZone } = useLocalization()
  const locale = localeOverride ?? contextLocale
  const is24HourFormat = is24HourFormatOverride ?? contextIs24HourFormat ?? true
  const timeZone = timeZoneOverride ?? contextTimeZone
  const [dateAndTimeStrings, setDateAndTimeStrings] = useState<DateAndTimeStrings>({
    compareDate: date,
    absolute: DateUtils.formatAbsolute(date, locale, absoluteFormat, { is24HourFormat, timeZone }),
    relative: DateUtils.formatRelative(date, locale),
  })

  useEffect(() => {
    setDateAndTimeStrings({
      compareDate: date,
      absolute: DateUtils.formatAbsolute(date, locale, absoluteFormat, { is24HourFormat, timeZone }),
      relative: DateUtils.formatRelative(date, locale),
    })
  }, [date, absoluteFormat, locale, is24HourFormat, timeZone])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const startTimer = () => {
      const now = new Date()
      const diff = Math.abs((date.getTime() - now.getTime()) / 1000)

      let delayInSeconds: number

      if(diff < DateUtils.timesInSeconds.minute) {
        delayInSeconds = DateUtils.timesInSeconds.second
      } else if(diff < DateUtils.timesInSeconds.hour) {
        delayInSeconds = DateUtils.timesInSeconds.minute
      } else {
        delayInSeconds = DateUtils.timesInSeconds.hour
      }

      timeoutId = setInterval(() => {
        setDateAndTimeStrings({
          compareDate: date,
          absolute: DateUtils.formatAbsolute(date, locale, absoluteFormat, { is24HourFormat, timeZone }),
          relative: DateUtils.formatRelative(date, locale),
        })
      }, delayInSeconds * 1000 / 2)
    }

    startTimer()

    return () => clearInterval(timeoutId)
  }, [absoluteFormat, date, locale, is24HourFormat, timeZone])

  return {
    absolute: dateAndTimeStrings.absolute,
    relative: dateAndTimeStrings.relative,
  }
}
