import type { HightideTranslationEntries, HightideTranslationLocales } from '@/src/i18n'
import { useTranslation } from './useTranslation'

export const useHightideTranslation = () => {
  return useTranslation<HightideTranslationLocales, HightideTranslationEntries>()
}