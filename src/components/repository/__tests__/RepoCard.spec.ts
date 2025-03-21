import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import RepoCard from '../RepoCard.vue'
import { useModalFactory } from '@/composables/useModalFactory'
import type { GithubRepository, ExtendedGithubRepository } from '@/services/github/types'
import type { DirectiveBinding } from 'vue'
import type { LongPressOptions } from '@/directives/longPress'

// Mock the modal factory
vi.mock('@/composables/useModalFactory', () => ({
  useModalFactory: vi.fn(),
}))

describe('RepoCard', () => {
  let wrapper: VueWrapper
  const mockShowDynamic = vi.fn()

  // Base repository mock
  const createMockRepository = (overrides?: Partial<ExtendedGithubRepository>): ExtendedGithubRepository => ({
    id: 1,
    name: 'test-repo',
    description: 'Test repository description',
    owner: {
      login: 'test-user',
      html_url: 'https://github.com/test-user',
      avatar_url: 'https://github.com/test-user.png',
    },
    html_url: 'https://github.com/test-user/test-repo',
    has_wiki: true,
    subscribers_count: 0,
    ...overrides,
  })

  // Helper to create wrapper with common options
  const createWrapper = (repository: ExtendedGithubRepository, withLongPress = false) => {
    return mount(RepoCard, {
      props: { repository },
      global: {
        directives: {
          'long-press': withLongPress
            ? {
                mounted(el: HTMLElement, binding: DirectiveBinding<LongPressOptions>) {
                  el.addEventListener('click', binding.value.onLongPress)
                },
              }
            : {},
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useModalFactory as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      showDynamic: mockShowDynamic,
    })
  })

  describe('rendering', () => {
    it('should render repository information correctly', () => {
      const repository = createMockRepository()
      wrapper = createWrapper(repository)

      expect(wrapper.find('h2').text()).toBe(repository.name)
      expect(wrapper.find('p').text()).toBe(repository.description)
      expect(wrapper.find('.font-medium').text()).toBe(repository.owner.login)
    })

    it('should handle missing description gracefully', () => {
      const repository = createMockRepository({ description: null })
      wrapper = createWrapper(repository)

      expect(wrapper.find('p').exists()).toBe(false)
    })
  })

  describe('styling', () => {
    it('should compute correct classes based on has_wiki flag', async () => {
      const repository = createMockRepository()
      wrapper = createWrapper(repository)

      // Test with has_wiki = true
      expect(wrapper.classes()).toContain('bg-white')
      expect(wrapper.classes()).not.toContain('bg-blue-50')

      // Test with has_wiki = false
      await wrapper.setProps({
        repository: createMockRepository({ has_wiki: false }),
      })

      expect(wrapper.classes()).toContain('bg-blue-50')
      expect(wrapper.classes()).not.toContain('bg-white')
    })
  })

  describe('interactions', () => {
    it('should show URL dialog with correct configuration on long press', async () => {
      const repository = createMockRepository()
      wrapper = createWrapper(repository, true)

      await wrapper.trigger('click')

      expect(mockShowDynamic).toHaveBeenCalledWith(expect.anything(), {
        repoUrl: repository.html_url,
        ownerUrl: repository.owner.html_url,
        title: 'Choose URL to open',
      })
    })

    it('should not recompute modal configuration on unrelated prop changes', async () => {
      const repository = createMockRepository()
      wrapper = createWrapper(repository, true)

      // First interaction
      await wrapper.trigger('click')
      expect(mockShowDynamic).toHaveBeenCalledTimes(1)
      const firstCallArgs = mockShowDynamic.mock.lastCall?.[1]
      expect(firstCallArgs).toBeDefined()

      // Change unrelated prop
      await wrapper.setProps({
        repository: createMockRepository({ has_wiki: false }),
      })

      // Second interaction
      await wrapper.trigger('click')
      expect(mockShowDynamic).toHaveBeenCalledTimes(2)
      const secondCallArgs = mockShowDynamic.mock.lastCall?.[1]
      expect(secondCallArgs).toBeDefined()
      expect(secondCallArgs).toEqual(firstCallArgs)
    })
  })
})
