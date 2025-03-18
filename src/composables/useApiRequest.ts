import { ref } from 'vue'
import { useCache } from './useCache'
import { useErrorHandler } from './useErrorHandler'

interface RequestConfig {
  baseURL?: string
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  cache?: {
    enabled?: boolean
    ttl?: number
  }
}

interface RequestOptions extends RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: Record<string, unknown>
}

export const useApiRequest = (defaultConfig: RequestConfig = {}) => {
  const baseURL = ref(defaultConfig.baseURL || '')
  const defaultHeaders = ref(defaultConfig.headers || {})
  const cache = useCache()
  const errorHandler = useErrorHandler()

  // Construct URL with query parameters
  const constructURL = (endpoint: string, params?: Record<string, string | number | boolean>) => {
    const url = new URL(endpoint, baseURL.value)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  // Create request configuration
  const createRequestConfig = (options: RequestOptions = {}) => {
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders.value,
        ...options.headers,
      },
    }

    if (options.body) {
      config.body = JSON.stringify(options.body)
    }

    return config
  }

  // Process response
  const processResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      throw response
    }
    return response.json()
  }

  // Handle caching
  const handleCache = <T>(key: string, options: RequestConfig = {}) => {
    if (options.cache?.enabled !== false) {
      const cachedData = cache.get<T>(key, {
        prefix: 'api',
        ttl: options.cache?.ttl,
      })
      if (cachedData) {
        return cachedData
      }
    }
    return null
  }

  // Set cache data
  const setCacheData = <T>(key: string, data: T, options: RequestConfig = {}) => {
    if (options.cache?.enabled !== false) {
      cache.set(key, data, {
        prefix: 'api',
        ttl: options.cache?.ttl,
      })
    }
  }

  // Execute request with error handling
  const executeRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    try {
      const url = constructURL(endpoint, options.params)
      const config = createRequestConfig(options)
      const response = await fetch(url, config)
      return await processResponse<T>(response)
    } catch (error) {
      throw await errorHandler.handleError(error)
    }
  }

  // Request methods
  const get = async <T>(endpoint: string, options: RequestConfig = {}) => {
    const cacheKey = cache.getCacheKey(endpoint, options.params, 'api')
    const cachedData = handleCache<T>(cacheKey, options)

    if (cachedData) {
      return cachedData
    }

    const data = await executeRequest<T>(endpoint, { ...options, method: 'GET' })
    setCacheData(cacheKey, data, options)
    return data
  }

  const post = async <T>(
    endpoint: string,
    data: Record<string, unknown>,
    options: RequestConfig = {},
  ) => {
    return executeRequest<T>(endpoint, { ...options, method: 'POST', body: data })
  }

  const put = async <T>(
    endpoint: string,
    data: Record<string, unknown>,
    options: RequestConfig = {},
  ) => {
    return executeRequest<T>(endpoint, { ...options, method: 'PUT', body: data })
  }

  const del = async <T>(endpoint: string, options: RequestConfig = {}) => {
    return executeRequest<T>(endpoint, { ...options, method: 'DELETE' })
  }

  return {
    get,
    post,
    put,
    delete: del,
    baseURL,
    defaultHeaders,
    cache,
    errorHandler,
  }
}
