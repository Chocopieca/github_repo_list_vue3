import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useGithubService } from '@/services/github/githubService'
import type { GithubRepository } from '@/types/github.types'
import { API_CONFIG } from '@/config/api'

const STORAGE_KEYS = {
  SCROLL: 'scrollPosition',
  REPOS: 'repositories',
  PAGE: 'currentPage'
} as const

const DEBOUNCE_DELAY = 100
const SCROLL_RESTORE_DELAY = 100

interface StorageState {
  repositories: GithubRepository[]
  page: number
  scrollPosition: number
}

export function useRepositoryList() {
  const repositories = ref<GithubRepository[]>([])
  const loading = ref(false)
  const page = ref(1)
  const scrollTimeout = ref<number | null>(null)

  const githubService = useGithubService()

  // Storage management
  const saveState = () => {
    const state: StorageState = {
      repositories: repositories.value,
      page: page.value,
      scrollPosition: window.scrollY
    }

    Object.entries(state).forEach(([key, value]) => {
      sessionStorage.setItem(
        STORAGE_KEYS[key as keyof typeof STORAGE_KEYS],
        JSON.stringify(value)
      )
    })
  }

  const restoreState = async () => {
    const savedState: Partial<StorageState> = {
      repositories: JSON.parse(sessionStorage.getItem(STORAGE_KEYS.REPOS) || 'null'),
      page: parseInt(sessionStorage.getItem(STORAGE_KEYS.PAGE) || '0'),
      scrollPosition: parseInt(sessionStorage.getItem(STORAGE_KEYS.SCROLL) || '0')
    }

    if (savedState.repositories) {
      repositories.value = savedState.repositories
      page.value = savedState.page || 1
    }

    if (savedState.scrollPosition) {
      await nextTick()
      setTimeout(() => {
        window.scrollTo({
          top: savedState.scrollPosition,
          behavior: 'instant'
        })
      }, SCROLL_RESTORE_DELAY)
    }
  }

  // Scroll handling
  const handleScroll = () => {
    if (scrollTimeout.value) {
      window.clearTimeout(scrollTimeout.value)
    }
    scrollTimeout.value = window.setTimeout(saveState, DEBOUNCE_DELAY)
  }

  // Data fetching
  const loadRepositories = async () => {
    if (loading.value) return

    try {
      loading.value = true
      const newRepos = await githubService.fetchPublicRepositories({
        organization: API_CONFIG.DEFAULT_ORGANIZATION,
        page: page.value,
        per_page: API_CONFIG.DEFAULT_PER_PAGE,
      })
      repositories.value.push(...newRepos)
      page.value++
      saveState()
    } catch (error) {
      console.error('Failed to load repositories:', error)
    } finally {
      loading.value = false
    }
  }

  // Lifecycle hooks
  onMounted(async () => {
    await restoreState()

    if (repositories.value.length === 0) {
      loadRepositories()
    }

    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimeout.value) {
      window.clearTimeout(scrollTimeout.value)
    }
  })

  return {
    repositories,
    loading,
    loadRepositories,
  }
}
