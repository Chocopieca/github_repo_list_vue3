export interface RequestConfig {
  baseURL?: string
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  cache?: {
    enabled?: boolean
    ttl?: number
  }
}

export interface ApiResponse<T> {
  data: T
  status: number
  headers?: Record<string, string>
}

export interface PaginationParams {
  page?: number
  per_page?: number
}

export interface ApiError extends Error {
  status?: number
  response?: unknown
}
