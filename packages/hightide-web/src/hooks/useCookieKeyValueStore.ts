'use client'

import { useEffect, useMemo, useState } from 'react'
import type { SimpleValueStore } from '@helpwave/hightide-utils/hooks'
import { CookieUtils } from '../utils/cookies'

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

/**
 * A store persisting values in cookies.
 *
 * The cookie domain is resolved after mounting, until then `isInitialized` is `false`,
 * so consumers like `useSimpleStoreSyncedValue` do not read or write during rendering and hydration.
 */
export const useCookieKeyValueStore = ({
  domain = 'auto',
  prefix = 'hightide-',
  maxAgeSeconds = ONE_YEAR_IN_SECONDS,
  fallbackStore,
}: UseCookieKeyValueStoreProps = {}): SimpleValueStore => {
  const [resolved, setResolved] = useState<{ domain: string | undefined } | null>(null)

  useEffect(() => {
    setResolved({
      domain: domain === 'auto' ? CookieUtils.resolveRegistrableDomain() : (domain ?? undefined),
    })
  }, [domain])

  return useMemo(() => {
    const resolvedDomain = resolved?.domain
    const cookieName = (key: string) => `${prefix}${key}`
    const deleteValue = (key: string) => {
      CookieUtils.remove(cookieName(key), { domain: resolvedDomain })
      // Also remove a host-only cookie that might shadow the shared one
      if (resolvedDomain) CookieUtils.remove(cookieName(key))
      fallbackStore?.deleteValue(key)
    }

    return {
      isInitialized: resolved !== null && (fallbackStore?.isInitialized ?? true),
      getValue: (key: string) => {
        if (resolved === null) return null
        const value = CookieUtils.get(cookieName(key))
        if (value !== null) return value
        return fallbackStore?.getValue(key) ?? null
      },
      setValue: (key: string, value: string | null) => {
        if (resolved === null) return
        if (value === null) {
          deleteValue(key)
          return
        }
        CookieUtils.set(cookieName(key), value, { domain: resolvedDomain, maxAgeSeconds })
        fallbackStore?.setValue(key, value)
      },
      deleteValue: (key: string) => {
        if (resolved === null) return
        deleteValue(key)
      },
    }
  }, [fallbackStore, maxAgeSeconds, prefix, resolved])
}
