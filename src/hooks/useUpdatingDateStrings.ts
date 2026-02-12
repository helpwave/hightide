import { useEffect, useState } from 'react'
import { DateUtils, type DateTimeFormat } from '../utils/date'
import type { HightideTranslationLocales } from '../i18n/translations'
import { useLocale } from '../global-contexts/LocaleContext'

export interface UseUpdatingDateStrings {
  absoluteFormat: DateTimeFormat,
  localeOverride: HightideTranslationLocales,
  date: Date,
}

type DateAndTimeStrings = {
  compareDate: Date,
  absolute: string,
  relative: string,
}

export const useUpdatingDateTime = ({ absoluteFormat, localeOverride, date }: UseUpdatingDateStrings) => {
  // TODO add a parameter to the hightide cofig
  const { locale: contextLocale } = useLocale()
  const locale = localeOverride ?? contextLocale
  const [dateAndTimeStrings, setDateAndTimeStrings] = useState<DateAndTimeStrings>({
    compareDate: date,
    absolute: DateUtils.formatAbsolute(date, locale, absoluteFormat),
    relative: DateUtils.formatRelative(date, locale),
  })

  useEffect(() => {
    setDateAndTimeStrings({
      compareDate: date,
      absolute: DateUtils.formatAbsolute(date, locale, absoluteFormat),
      relative: DateUtils.formatRelative(date, locale),
    })
  }, [date, absoluteFormat, locale])

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
          absolute: DateUtils.formatAbsolute(date, locale, absoluteFormat),
          relative: DateUtils.formatRelative(date, locale),
        })
        // We divide by 2 to have cleaner updates
      }, delayInSeconds * 1000 / 2)
    }

    startTimer()

    return () => clearInterval(timeoutId)
  }, [absoluteFormat, date, locale])

  return {
    absolute: dateAndTimeStrings.absolute,
    relative: dateAndTimeStrings.relative,
  }
}