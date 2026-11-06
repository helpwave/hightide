/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://tasks.helpwave.de/"}
 */

import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { renderHook } from '@testing-library/react'
import { useBrowserKeyValueStore } from '@helpwave/hightide-utils/hooks'
import { useCookieKeyValueStore } from '../../src/hooks/useCookieKeyValueStore'
import { CookieUtils } from '../../src/utils/cookies'

const clearCookies = () => {
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim()
    if (!name) continue
    CookieUtils.remove(decodeURIComponent(name), { domain: 'helpwave.de' })
    CookieUtils.remove(decodeURIComponent(name))
  }
}

describe('CookieUtils.resolveRegistrableDomain', () => {
  test('resolves the registrable domain of the current host', () => {
    expect(CookieUtils.resolveRegistrableDomain()).toBe('helpwave.de')
  })

  test('returns undefined for localhost and IPs', () => {
    expect(CookieUtils.resolveRegistrableDomain('localhost')).toBeUndefined()
    expect(CookieUtils.resolveRegistrableDomain('127.0.0.1')).toBeUndefined()
  })
})

describe('useCookieKeyValueStore', () => {
  beforeEach(() => {
    clearCookies()
    window.localStorage.clear()
  })

  test('is not initialized and does not touch cookies before mounting', () => {
    const getSpy = jest.spyOn(CookieUtils, 'get')
    const resolveSpy = jest.spyOn(CookieUtils, 'resolveRegistrableDomain')
    const states: boolean[] = []
    const Probe = () => {
      const store = useCookieKeyValueStore()
      states.push(store.isInitialized)
      store.getValue('theme')
      return null
    }

    renderToString(createElement(Probe))

    expect(states).toEqual([false])
    expect(getSpy).not.toHaveBeenCalled()
    expect(resolveSpy).not.toHaveBeenCalled()
    getSpy.mockRestore()
    resolveSpy.mockRestore()
  })

  test('is initialized after mounting', () => {
    const { result } = renderHook(() => useCookieKeyValueStore())

    expect(result.current.isInitialized).toBe(true)
  })

  test('writes prefixed cookies on the shared domain', () => {
    const setSpy = jest.spyOn(CookieUtils, 'set')
    const { result } = renderHook(() => useCookieKeyValueStore())

    result.current.setValue('theme', 'dark')

    expect(result.current.getValue('theme')).toBe('dark')
    expect(CookieUtils.get('hightide-theme')).toBe('dark')
    expect(setSpy).toHaveBeenCalledWith('hightide-theme', 'dark', expect.objectContaining({ domain: 'helpwave.de' }))
    setSpy.mockRestore()
  })

  test('uses host-only cookies when domain is null', () => {
    const setSpy = jest.spyOn(CookieUtils, 'set')
    const { result } = renderHook(() => useCookieKeyValueStore({ domain: null }))

    result.current.setValue('locale', 'de-DE')

    expect(result.current.getValue('locale')).toBe('de-DE')
    expect(setSpy).toHaveBeenCalledWith('hightide-locale', 'de-DE', expect.objectContaining({ domain: undefined }))
    setSpy.mockRestore()
  })

  test('falls back to and syncs with the fallback store', () => {
    window.localStorage.setItem('locale', 'de-DE')
    const { result: browser } = renderHook(() => useBrowserKeyValueStore())
    const { result } = renderHook(() => useCookieKeyValueStore({ fallbackStore: browser.current }))

    expect(result.current.getValue('locale')).toBe('de-DE')

    result.current.setValue('locale', 'en-US')
    expect(CookieUtils.get('hightide-locale')).toBe('en-US')
    expect(window.localStorage.getItem('locale')).toBe('en-US')

    result.current.deleteValue('locale')
    expect(result.current.getValue('locale')).toBeNull()
    expect(window.localStorage.getItem('locale')).toBeNull()
  })
})
