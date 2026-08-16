import { useTranslation } from '@helpwave/hightide-utils/context/translation'

export type DemoTranslationEntries = {
  featureTitle: string,
  featureHint: string,
  welcome?: string,
  filterOptions?: string,
  nResultsFound?: string,
  searchResults?: string,
}

export const useExtendedTranslation = () => {
  return useTranslation<string, DemoTranslationEntries>()
}
