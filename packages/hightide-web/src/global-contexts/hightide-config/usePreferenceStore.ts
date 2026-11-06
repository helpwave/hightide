import type { SimpleValueStore } from '@helpwave/hightide-utils/hooks'
import { useBrowserKeyValueStore } from '@helpwave/hightide-utils/hooks'
import { useCookieKeyValueStore } from '../../hooks/useCookieKeyValueStore'
import { useHightideConfig } from './HightideConfigContext'

/**
 * The store used for persisting user preferences like theme and locale.
 *
 * By default, values are stored in cookies on the registrable domain so that all subdomains
 * (e.g. `tasks.helpwave.de`, `id.helpwave.de`) share them. localStorage is kept as fallback and in sync,
 * which also migrates previously stored values.
 * Set `preferenceStorage.shareAcrossSubdomains` to `false` in the config to only use localStorage.
 */
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
