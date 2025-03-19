import { ref } from 'vue'

// Default cache settings
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds
const KEY_SEPARATOR = ':'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheOptions {
  ttl?: number
  enabled?: boolean
  prefix?: string
}

export const useCache = () => {
  const cache = ref<Map<string, CacheItem<unknown>>>(new Map())

  const getPrefixedKey = (key: string, prefix?: string): string => {
    return prefix ? `${prefix}${KEY_SEPARATOR}${key}` : key
  }

  const isExpired = (item: CacheItem<unknown>): boolean => {
    return Date.now() - item.timestamp > item.ttl
  }

  const set = <T>(key: string, data: T, options: CacheOptions = {}) => {
    const prefixedKey = getPrefixedKey(key, options.prefix)
    cache.value.set(prefixedKey, {
      data,
      timestamp: Date.now(),
      ttl: options.ttl || DEFAULT_TTL,
    })
  }

  const get = <T>(key: string, options: CacheOptions = {}): T | null => {
    const prefixedKey = getPrefixedKey(key, options.prefix)
    const item = cache.value.get(prefixedKey) as CacheItem<T> | undefined

    if (!item || isExpired(item)) {
      cache.value.delete(prefixedKey)
      return null
    }

    return item.data
  }

  const has = (key: string, options: CacheOptions = {}): boolean => {
    const prefixedKey = getPrefixedKey(key, options.prefix)
    const item = cache.value.get(prefixedKey)

    if (!item || isExpired(item)) {
      cache.value.delete(prefixedKey)
      return false
    }

    return true
  }

  const remove = (key: string, options: CacheOptions = {}) => {
    cache.value.delete(getPrefixedKey(key, options.prefix))
  }

  const removeByPrefix = (prefix: string) => {
    const searchPrefix = `${prefix}${KEY_SEPARATOR}`
    for (const key of cache.value.keys()) {
      if (key.startsWith(searchPrefix)) {
        cache.value.delete(key)
      }
    }
  }

  const getCacheKey = (
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    prefix?: string,
  ): string => {
    if (!params) return getPrefixedKey(endpoint, prefix)

    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString()

    return getPrefixedKey(
      `${endpoint}${queryString ? `?${queryString}` : ''}`,
      prefix
    )
  }

  return {
    set,
    get,
    has,
    remove,
    removeByPrefix,
    clear: () => cache.value.clear(),
    getCacheKey,
  }
}
