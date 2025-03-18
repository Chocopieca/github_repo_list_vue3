import { ref } from 'vue'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  enabled?: boolean
  prefix?: string // Add prefix option
}

export const useCache = () => {
  const cache = ref<Map<string, CacheItem<unknown>>>(new Map())

  // Add prefix handling function
  const getPrefixedKey = (key: string, prefix?: string): string => {
    return prefix ? `${prefix}:${key}` : key
  }

  // Update set function to handle prefixes
  const set = <T>(key: string, data: T, options: CacheOptions = {}) => {
    const ttl = options.ttl || 5 * 60 * 1000 // Default 5 minutes
    const prefixedKey = getPrefixedKey(key, options.prefix)
    cache.value.set(prefixedKey, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  // Update get function to handle prefixes
  const get = <T>(key: string, options: CacheOptions = {}): T | null => {
    const prefixedKey = getPrefixedKey(key, options.prefix)
    const item = cache.value.get(prefixedKey) as CacheItem<T> | undefined

    if (!item) {
      return null
    }

    const isExpired = Date.now() - item.timestamp > item.ttl
    if (isExpired) {
      cache.value.delete(prefixedKey)
      return null
    }

    return item.data
  }

  // Update has function to handle prefixes
  const has = (key: string, options: CacheOptions = {}): boolean => {
    const prefixedKey = getPrefixedKey(key, options.prefix)
    const item = cache.value.get(prefixedKey)
    if (!item) return false

    const isExpired = Date.now() - item.timestamp > item.ttl
    if (isExpired) {
      cache.value.delete(prefixedKey)
      return false
    }

    return true
  }

  // Update remove function to handle prefixes
  const remove = (key: string, options: CacheOptions = {}) => {
    const prefixedKey = getPrefixedKey(key, options.prefix)
    cache.value.delete(prefixedKey)
  }

  // Add method to remove all items with specific prefix
  const removeByPrefix = (prefix: string) => {
    for (const key of cache.value.keys()) {
      if (key.startsWith(`${prefix}:`)) {
        cache.value.delete(key)
      }
    }
  }

  // Get cache key from request parameters
  const getCacheKey = (
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    prefix?: string,
  ): string => {
    const queryString = params
      ? new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]))
      : ''
    const key = `${endpoint}${queryString ? `?${queryString}` : ''}`
    return getPrefixedKey(key, prefix)
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
