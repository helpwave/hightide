import type { ReactNode } from 'react'
import { hightideTranslation } from '@helpwave/hightide-utils/i18n'
import { useMemoryKeyValueStore } from '@helpwave/hightide-utils/hooks'
import { HightideConfigProvider } from '../../src/global-contexts/hightide-config'
import { LocalizationProvider } from '../../src/global-contexts/localization'
import { TranslationProvider } from '../../src/global-contexts/translation'

export const TestHightideProvider = ({
  children,
  locale = 'en-US',
  is24HourFormat,
  timeZone,
}: {
  children: ReactNode,
  locale?: string,
  is24HourFormat?: boolean,
  timeZone?: string,
}) => {
  const store = useMemoryKeyValueStore()

  return (
    <HightideConfigProvider>
      <LocalizationProvider
        store={store}
        locale={locale}
        is24HourFormat={is24HourFormat}
        timeZone={timeZone}
      >
        <TranslationProvider translation={hightideTranslation}>
          {children}
        </TranslationProvider>
      </LocalizationProvider>
    </HightideConfigProvider>
  )
}
