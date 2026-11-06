import { useMemo } from 'react'
import type { SimpleValueStore } from './useSimpleStoreSyncedValue'
import { CookieUtils } from '../utils/cookie'

export type UseCookieKeyValueStoreProps = {
  /**
   * The domain the cookies are scoped to.
   * - `'auto'` (default): the registrable domain of the current host (e.g. `helpwave.de` on `tasks.helpwave.de`),
   *   so all subdomains share the same values
   * - a string: that exact domain
   * - `null`: host-only cookies, nothing is shared with other hosts
   */
  domain?: 'auto' | string | null,
  /** Prefix for every cookie name to avoid collisions with other cookies on the shared domain. Defaults to `hightide-`. */
  prefix?: string,
  /** Lifetime of the cookies in seconds. Defaults to one year. */
  maxAgeSeconds?: number,
  /**
   * An optional store used as read fallback and kept in sync on writes.
   * Useful to migrate values previously persisted in e.g. localStorage.
   */
  fallbackStore?: SimpleValueStore,
}

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

export const useCookieKeyValueStore = ({
  domain = 'auto',
  prefix = 'hightide-',
  maxAgeSeconds = ONE_YEAR_IN_SECONDS,
  fallbackStore,
}: UseCookieKeyValueStoreProps = {}): SimpleValueStore => {
  const isClient = typeof document !== 'undefined'

  const resolvedDomain = useMemo(() => {
    if (!isClient || domain === null) return undefined
    if (domain === 'auto') return CookieUtils.resolveRegistrableDomain()
    return domain
  }, [domain, isClient])

  return useMemo(() => {
    const cookieName = (key: string) => `${prefix}${key}`
    const deleteValue = (key: string) => {
      CookieUtils.remove(cookieName(key), { domain: resolvedDomain })
      // Also remove a host-only cookie that might shadow the shared one
      if (resolvedDomain) CookieUtils.remove(cookieName(key))
      fallbackStore?.deleteValue(key)
    }

    return {
      isInitialized: isClient && (fallbackStore?.isInitialized ?? true),
      getValue: (key: string) => {
        const value = CookieUtils.get(cookieName(key))
        if (value !== null) return value
        return fallbackStore?.getValue(key) ?? null
      },
      setValue: (key: string, value: string | null) => {
        if (value === null) {
          deleteValue(key)
          return
        }
        CookieUtils.set(cookieName(key), value, { domain: resolvedDomain, maxAgeSeconds })
        fallbackStore?.setValue(key, value)
      },
      deleteValue,
    }
  }, [fallbackStore, isClient, maxAgeSeconds, prefix, resolvedDomain])
}
