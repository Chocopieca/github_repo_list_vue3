import type { GithubRepository } from '@/types/github.types'
import type { PaginationParams } from '@/types/api.types'

export interface GithubServiceConfig {
  baseURL: string
  token?: string
}

export interface FetchRepositoriesParams extends PaginationParams {
  organization: string
}

export interface IGithubService {
  fetchPublicRepositories(params: FetchRepositoriesParams): Promise<GithubRepository[]>
}
