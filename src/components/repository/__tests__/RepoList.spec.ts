import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import RepoList from '../RepoList.vue'
import { useRepositoryList } from '@/composables/useRepositoryList'
import type { GithubRepository } from '@/services/github/types'
import { vInfiniteScroll } from '@/directives/infiniteScroll'
import { createPinia, setActivePinia } from 'pinia'
import { vLongPress } from '@/directives/longPress'
import { ref } from 'vue'

vi.mock('@/composables/useRepositoryList')

describe('RepoList', () => {
  let wrapper: VueWrapper
  const loadRepositories = vi.fn()
  const repositories = ref<GithubRepository[]>([])
  const loading = ref(false)

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
    has_wiki: true
  })

  // Helper to create wrapper with common options
  const createWrapper = (attachToBody = false) => {
    const wrapper = mount(RepoList, {
      global: {
        directives: {
          'long-press': vLongPress,
          'infinite-scroll': vInfiniteScroll,
        },
      },
      ...(attachToBody ? { attachTo: document.body } : {}),
    })
    return wrapper
  }

  // Helper to setup window properties for scroll tests
  const setupScrollEnvironment = (scrollY = 0) => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      configurable: true,
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    setActivePinia(createPinia())

    // Reset state
    loading.value = false
    repositories.value = [createMockRepository(1)]

    // Setup mock
    ;(useRepositoryList as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      repositories,
      loading,
      loadRepositories,
    })

    // Setup default scroll environment
    setupScrollEnvironment()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('rendering', () => {
    it('should render list of repositories', () => {
      wrapper = createWrapper()
      expect(wrapper.findAll('.p-4')).toHaveLength(repositories.value.length)
    })

    it('should render empty list when no repositories', () => {
      repositories.value = []
      wrapper = createWrapper()
      expect(wrapper.find('.empty-list').exists()).toBe(true)
    })

    it('should show loading indicator when loading', () => {
      loading.value = true
      wrapper = createWrapper()
      expect(wrapper.find('.loading-indicator').exists()).toBe(true)
    })
  })

  describe('infinite scroll', () => {
    it('should load more repositories on scroll', async () => {
      wrapper = createWrapper(true)
      await wrapper.vm.$nextTick()

      // Simulate scroll near bottom
      setupScrollEnvironment(150)
      window.dispatchEvent(new Event('scroll'))

      expect(loadRepositories).toHaveBeenCalled()
    })

    it('should not load more when already loading', async () => {
      loading.value = true
      wrapper = createWrapper(true)

      await wrapper.vm.$nextTick()
      await vi.runAllTimersAsync()

      // Simulate scroll near bottom
      setupScrollEnvironment(150)
      window.dispatchEvent(new Event('scroll'))

      await wrapper.vm.$nextTick()
      await vi.runAllTimersAsync()

      expect(loadRepositories).not.toHaveBeenCalled()
    })
  })
})
