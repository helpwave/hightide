import type { SimpleValueStore } from '@helpwave/hightide-utils/hooks'
import { useBrowserKeyValueStore } from '@helpwave/hightide-utils/hooks'
import { useCookieKeyValueStore } from '../../hooks/useCookieKeyValueStore'
import { useHightideConfig } from './HightideConfigContext'

export const usePreferenceStore = (): SimpleValueStore => {
  const { config } = useHightideConfig()
  const { shareAcrossSubdomains, cookieDomain, cookiePrefix } = config.preferenceStorage
  const browserStore = useBrowserKeyValueStore()
  const cookieStore = useCookieKeyValueStore({
    domain: cookieDomain ?? 'auto',
    prefix: cookiePrefix,
    fallbackStore: browserStore,
  })
  return shareAcrossSubdomains ? cookieStore : browserStore
}
