import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useRepositoryList } from '../useRepositoryList'
import { useGithubService, type IGithubService } from '@/services/github/githubService'
import { API_CONFIG } from '@/config/api'
import type { GithubRepository } from '@/types/github.types'
import { defineComponent } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'

vi.mock('@/services/github/githubService', () => ({
  useGithubService: vi.fn(
    () =>
      ({
        fetchPublicRepositories: vi.fn(),
      }) as IGithubService,
  ),
}))

interface InitialState {
  repositories?: GithubRepository[]
  loading?: boolean
}

interface RepositoryListComponent {
  repositories: GithubRepository[]
  loading: boolean
  loadRepositories: () => Promise<void>
  updateRepositories: (repos: GithubRepository[]) => void
  setLoading: (value: boolean) => void
}

type TestWrapper = VueWrapper<RepositoryListComponent>

describe('useRepositoryList', () => {
  let wrapper: TestWrapper
  const mockFetchPublicRepositories = vi.fn()

  // Helper to create mock repository
  const createMockRepository = (id: number): GithubRepository => ({
    id,
    name: `test-repo-${id}`,
    description: `Test repository ${id}`,
    owner: {
      login: 'test-user',
      html_url: 'https://github.com/test-user',
      avatar_url: 'https://github.com/test-user.png',
    },
    html_url: `https://github.com/test-user/test-repo-${id}`,
    has_wiki: true,
  })

  // Helper to create test component wrapper
  const createWrapper = (initialState: InitialState = {}): TestWrapper => {
    return mount(
      defineComponent({
        setup() {
          const repositoryList = useRepositoryList()

          if (initialState.repositories) {
            repositoryList.repositories.value = initialState.repositories
          }
          if (typeof initialState.loading === 'boolean') {
            repositoryList.loading.value = initialState.loading
          }

          return {
            ...repositoryList,
            updateRepositories: (repos: GithubRepository[]) => {
              repositoryList.repositories.value = repos
            },
            setLoading: (value: boolean) => {
              repositoryList.loading.value = value
            },
          }
        },
        template: '<div></div>',
      }),
    ) as TestWrapper
  }

  // Helper to setup storage mock
  const setupStorageMock = (initialData?: Record<string, string>) => {
    const mockStorage = new Map<string, string>(Object.entries(initialData || {}))
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => mockStorage.get(key) || null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) =>
      mockStorage.set(key, value),
    )
    return mockStorage
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchPublicRepositories.mockResolvedValue([createMockRepository(1)])

    // Setup mocks
    vi.mocked(useGithubService).mockReturnValue({
      fetchPublicRepositories: mockFetchPublicRepositories,
    } as IGithubService)

    setupStorageMock()

    // Mock window methods
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
    window.scrollTo = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  describe('initialization', () => {
    it('should load repositories on mount when no saved state exists', async () => {
      mockFetchPublicRepositories.mockResolvedValueOnce([])
      wrapper = createWrapper()
      await vi.runAllTimersAsync()

      expect(mockFetchPublicRepositories).toHaveBeenCalledWith({
        organization: 'nodejs',
        page: 1,
        per_page: API_CONFIG.DEFAULT_PER_PAGE,
      })
      expect(wrapper.vm.repositories).toEqual([])
    })

    it('should restore state from session storage', async () => {
      const mockRepositories = [createMockRepository(1)]
      setupStorageMock({
        repositories: JSON.stringify(mockRepositories),
        currentPage: '2',
        scrollPosition: '100',
      })

      wrapper = createWrapper()
      await vi.runAllTimersAsync()

      expect(wrapper.vm.repositories).toEqual(mockRepositories)
    })
  })

  describe('state management', () => {
    it('should save state on scroll', async () => {
      const mockRepositories = [createMockRepository(1)]
      wrapper = createWrapper()
      wrapper.vm.updateRepositories(mockRepositories)

      window.dispatchEvent(new Event('scroll'))
      await vi.runAllTimersAsync()

      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'repositories',
        JSON.stringify(mockRepositories),
      )
    })

    it('should cleanup event listeners on unmount', async () => {
      wrapper = createWrapper()
      await vi.runAllTimersAsync()

      wrapper.unmount()

      expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    })
  })

  describe('repository loading', () => {
    it('should load more repositories when loadRepositories is called', async () => {
      wrapper = createWrapper()
      wrapper.vm.updateRepositories([])

      await wrapper.vm.loadRepositories()
      await vi.runAllTimersAsync()

      expect(mockFetchPublicRepositories).toHaveBeenCalledWith({
        organization: 'nodejs',
        page: 1,
        per_page: API_CONFIG.DEFAULT_PER_PAGE,
      })
    })

    it('should not load repositories if already loading', async () => {
      wrapper = createWrapper({ loading: true, repositories: [createMockRepository(1)] })

      vi.clearAllMocks()
      await wrapper.vm.loadRepositories()
      await vi.runAllTimersAsync()

      expect(mockFetchPublicRepositories).not.toHaveBeenCalled()
    })

    it('should handle errors when loading repositories', async () => {
      const error = new Error('Failed to fetch')
      mockFetchPublicRepositories.mockRejectedValueOnce(error)
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      wrapper = createWrapper()
      await wrapper.vm.loadRepositories()
      await vi.runAllTimersAsync()

      expect(wrapper.vm.repositories).toEqual([])
      expect(consoleError).toHaveBeenCalledWith('Failed to load repositories:', error)
      consoleError.mockRestore()
    })
  })
})
