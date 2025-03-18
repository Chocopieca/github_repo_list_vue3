export class BaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class ApiError extends BaseError {
  constructor(
    message: string,
    public status: number,
    public originalError: unknown,
    public details?: Record<string, unknown>,
  ) {
    super(message)
  }
}

export class NetworkError extends BaseError {
  constructor() {
    super('Network error occurred')
  }
}

export class UnknownError extends BaseError {
  constructor(public originalError: unknown) {
    super('An unknown error occurred')
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string, originalError: unknown) {
    super(message, 403, originalError)
  }
}
