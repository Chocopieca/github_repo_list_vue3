import { ApiError, NetworkError, UnknownError, BaseError, RateLimitError } from './ApiError'

export class ErrorFactory {
  static async createError(error: unknown): Promise<BaseError> {
    // Handle fetch Response errors
    if (error instanceof Response) {
      let errorData: { message?: string; details?: Record<string, unknown> }

      try {
        errorData = await error.json()
      } catch {
        errorData = { message: error.statusText }
      }

      // Check for rate limit error
      if (error.status === 403 && errorData.message?.includes('API rate limit exceeded')) {
        return new RateLimitError(errorData.message, error)
      }

      return new ApiError(
        errorData.message || `HTTP Error ${error.status}`,
        error.status,
        error,
        errorData.details,
      )
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return new NetworkError()
    }

    // Handle API errors that were already created
    if (
      error instanceof ApiError ||
      error instanceof NetworkError ||
      error instanceof RateLimitError
    ) {
      return error
    }

    // Handle unknown errors
    return new UnknownError(error)
  }
}
