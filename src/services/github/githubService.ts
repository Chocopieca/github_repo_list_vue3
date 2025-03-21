import { BaseApiService } from '../api/baseApiService'
import { useGithubAuthStore } from '@/stores/githubAuth'
import { API_CONFIG } from '@/config/api'
import type { FetchRepositoriesParams, GithubServiceConfig } from './types'
import type { GithubApiResponse, GithubRepository, IGithubService, GithubRepositoryDitels  } from '@/services/github/types'


export class GithubService extends BaseApiService implements IGithubService {
  private authStore = useGithubAuthStore()

  constructor(config: GithubServiceConfig) {
    super({
      baseURL: config.baseURL,
    })
  }

  protected getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      ...super.getHeaders(),
      Accept: 'application/vnd.github.v3+json',
    }

    const token = this.authStore.token || API_CONFIG.GITHUB_TOKEN
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  public async fetchPublicRepositories(
    params: FetchRepositoriesParams,
  ): Promise<GithubRepository[]> {
    const response = await this.api.get<GithubApiResponse>('/search/repositories', {
      params: {
        q: `org:${params.organization}`,
        page: params.page || 1,
        per_page: params.per_page || API_CONFIG.DEFAULT_PER_PAGE,
        sort: 'updated',
        order: 'desc',
      },
      headers: this.getHeaders(),
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5 minutes
      },
    })

    return response.items
  }

  public async fetchRepositorieDitels(repo: string): Promise<GithubRepositoryDitels> {

    return await this.api.get<GithubRepositoryDitels>(`/repos/nodejs/${repo}`, {
      headers: this.getHeaders(),
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5 minutes
      },
    })
  }
}

// Composable for using GithubService
export const useGithubService = (): IGithubService => {
  return new GithubService({
    baseURL: API_CONFIG.GITHUB_API_URL,
  })
}
