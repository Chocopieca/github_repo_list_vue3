export interface GithubRepository {
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

export interface GithubApiResponse {
  items: GithubRepository[]
  total_count: number
}

export interface FetchRepositoriesParams {
  page?: number
  per_page?: number
  organization?: string
}
