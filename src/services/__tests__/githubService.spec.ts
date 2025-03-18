import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { GithubService } from '../github/githubService'
import { useApiRequest } from '@/composables/useApiRequest'
import { useGithubAuthStore } from '@/stores/githubAuth'
import { API_CONFIG } from '@/config/api'
import type { FetchRepositoriesParams } from '../github/types'

vi.mock('@/composables/useApiRequest')
vi.mock('@/stores/githubAuth')

describe('GithubService', () => {
  let service: GithubService
  const mockGet = vi.fn()
  const mockResponse = { items: [] }

  // Helper to create request parameters
  const createRequestParams = (
    overrides?: Partial<FetchRepositoriesParams>,
  ): FetchRepositoriesParams => ({
    organization: API_CONFIG.DEFAULT_ORGANIZATION,
    page: 1,
    per_page: API_CONFIG.DEFAULT_PER_PAGE,
    ...overrides,
  })

  // Helper to create expected request config
  const createExpectedRequestConfig = (params: FetchRepositoriesParams, token?: string) => ({
    headers: expect.objectContaining({
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    params: {
      q: `org:${params.organization}`,
      sort: 'updated',
      order: 'desc',
      page: params.page,
      per_page: params.per_page,
    },
    cache: {
      enabled: true,
      ttl: 5 * 60 * 1000,
    },
  })

  // Helper to setup service with auth token
  const setupServiceWithToken = (token: string | null = null) => {
    ;(useGithubAuthStore as unknown as Mock).mockReturnValue({ token })
    return new GithubService({ baseURL: API_CONFIG.GITHUB_API_URL })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useApiRequest as Mock).mockReturnValue({ get: mockGet })
    mockGet.mockResolvedValue(mockResponse)
    service = setupServiceWithToken()
  })

  describe('fetchPublicRepositories', () => {
    it('should fetch repositories with default parameters', async () => {
      const params = createRequestParams()
      const result = await service.fetchPublicRepositories(params)

      expect(mockGet).toHaveBeenCalledWith(
        '/search/repositories',
        createExpectedRequestConfig(params),
      )
      expect(result).toEqual([])
    })

    it('should fetch repositories with custom parameters', async () => {
      const params = createRequestParams({
        organization: 'custom-org',
        page: 2,
        per_page: 20,
      })

      const result = await service.fetchPublicRepositories(params)

      expect(mockGet).toHaveBeenCalledWith(
        '/search/repositories',
        createExpectedRequestConfig(params),
      )
      expect(result).toEqual([])
    })

    it('should use auth token from store when available', async () => {
      const mockToken = 'test-token'
      service = setupServiceWithToken(mockToken)
      const params = createRequestParams()

      await service.fetchPublicRepositories(params)

      expect(mockGet).toHaveBeenCalledWith(
        '/search/repositories',
        createExpectedRequestConfig(params, mockToken),
      )
    })
  })
})
