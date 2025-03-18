import { useApiRequest } from '@/composables/useApiRequest'
import type { RequestConfig } from '@/types/api.types'

export abstract class BaseApiService {
  protected api

  constructor(baseConfig: RequestConfig = {}) {
    this.api = useApiRequest(baseConfig)
  }

  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  }
}
