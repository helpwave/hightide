import { SafeGlobals } from './safeGlobals'

export type CookieWriteOptions = {
  domain?: string,
  path?: string,
  maxAgeSeconds?: number,
  sameSite?: 'Lax' | 'Strict' | 'None',
  secure?: boolean,
}

const get = (name: string): string | null => {
  const doc = SafeGlobals.document('CookieUtils.get')
  if (!doc) return null
  const encodedName = encodeURIComponent(name)
  for (const part of doc.cookie.split(';')) {
    const separatorIndex = part.indexOf('=')
    if (separatorIndex === -1) continue
    if (part.slice(0, separatorIndex).trim() !== encodedName) continue
    try {
      return decodeURIComponent(part.slice(separatorIndex + 1).trim())
    } catch {
      return null
    }
  }
  return null
}

const set = (name: string, value: string, {
  domain,
  path = '/',
  maxAgeSeconds,
  sameSite = 'Lax',
  secure,
}: CookieWriteOptions = {}) => {
  const doc = SafeGlobals.document('CookieUtils.set')
  if (!doc) return
  const isSecure = secure ?? doc.location?.protocol === 'https:'
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`, `Path=${path}`, `SameSite=${sameSite}`]
  if (domain) parts.push(`Domain=${domain}`)
  if (maxAgeSeconds !== undefined) parts.push(`Max-Age=${Math.floor(maxAgeSeconds)}`)
  if (isSecure || sameSite === 'None') parts.push('Secure')
  doc.cookie = parts.join('; ')
}

const remove = (name: string, options: Omit<CookieWriteOptions, 'maxAgeSeconds'> = {}) => {
  set(name, '', { ...options, maxAgeSeconds: 0 })
}

const isIpAddress = (hostname: string) => /^[\d.]+$/.test(hostname) || hostname.includes(':')

const registrableDomainCache = new Map<string, string | undefined>()

const resolveRegistrableDomain = (hostname?: string): string | undefined => {
  hostname ??= SafeGlobals.window('CookieUtils.resolveRegistrableDomain')?.location.hostname
  if (!hostname) return undefined
  hostname = hostname.toLowerCase().replace(/\.$/, '')
  if (registrableDomainCache.has(hostname)) return registrableDomainCache.get(hostname)

  let result: string | undefined = undefined
  const labels = hostname.split('.')
  if (!isIpAddress(hostname) && labels.length >= 2) {
    const probeName = `__hightide_domain_probe_${Math.random().toString(36).slice(2)}`
    for (let count = 2; count <= labels.length; count++) {
      const candidate = labels.slice(-count).join('.')
      set(probeName, '1', { domain: candidate, maxAgeSeconds: 10 })
      if (get(probeName) === '1') {
        remove(probeName, { domain: candidate })
        result = candidate
        break
      }
    }
  }
  registrableDomainCache.set(hostname, result)
  return result
}

export const CookieUtils = {
  get,
  set,
  remove,
  resolveRegistrableDomain,
}
