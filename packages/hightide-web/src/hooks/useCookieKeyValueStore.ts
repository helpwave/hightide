'use client'

import { useEffect, useMemo, useState } from 'react'
import type { SimpleValueStore } from '@helpwave/hightide-utils/hooks'
import { CookieUtils } from '../utils/cookies'

export type UseCookieKeyValueStoreProps = {
  domain?: 'auto' | string | null,
  prefix?: string,
  maxAgeSeconds?: number,
  fallbackStore?: SimpleValueStore,
}

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

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
