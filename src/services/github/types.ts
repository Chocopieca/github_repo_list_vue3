export interface GithubServiceConfig {
  baseURL: string
  token?: string
}

export interface GithubRepositoryDitels {
  subscribers_count: number | string
}

export interface GithubApiResponse {
  items: GithubRepository[]
  total_count: number
}

export interface GithubRepository extends GithubRepositoryDitels {
  id: number
  name: string
  description: string | null
  html_url: string
  has_wiki: boolean
  owner: {
    login: string
    html_url: string
    avatar_url: string
  }
}

export interface FetchRepositoriesParams {
  page?: number
  per_page?: number
  organization?: string
}



export interface PaginationParams {
  page?: number
  per_page?: number
}

export interface IGithubService {
  fetchPublicRepositories(params: FetchRepositoriesParams): Promise<GithubRepository[]>
  fetchRepositorieDitels(repo: string): Promise<GithubRepositoryDitels>
}
