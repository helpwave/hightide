import type {
  HightideTranslationEntries,
  HightideTranslationLocales
} from '../../i18n/translations'
import { useTranslation } from './useTranslation'

export const useHightideTranslation = () => {
  return useTranslation<HightideTranslationLocales, HightideTranslationEntries>()
}