import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useGithubService } from '@/services/github/githubService'
import type { GithubRepository } from '@/types/github.types'
import { API_CONFIG } from '@/config/api'

export function useRepositoryList() {
  const repositories = ref<GithubRepository[]>([])
  const loading = ref(false)
  const page = ref(1)

  const githubService = useGithubService()

  // Save state to sessionStorage
  const saveState = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString())
    sessionStorage.setItem('repositories', JSON.stringify(repositories.value))
    sessionStorage.setItem('currentPage', page.value.toString())
  }

  // Handle scroll event with debounce
  let scrollTimeout: number | null = null
  const handleScroll = () => {
    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout)
    }
    scrollTimeout = window.setTimeout(() => {
      saveState()
    }, 100)
  }

  const loadRepositories = async () => {
    if (loading.value) return

    try {
      loading.value = true
      const newRepos = await githubService.fetchPublicRepositories({
        organization: 'nodejs',
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

  // Restore state and scroll position
  const restoreState = async () => {
    const savedRepositories = sessionStorage.getItem('repositories')
    const savedPage = sessionStorage.getItem('currentPage')
    const savedScrollPosition = sessionStorage.getItem('scrollPosition')

    if (savedRepositories) {
      repositories.value = JSON.parse(savedRepositories)
    }
    if (savedPage) {
      page.value = parseInt(savedPage)
    }

    // Restore scroll position after DOM update
    if (savedScrollPosition) {
      await nextTick()
      // Add a small delay to ensure all content is rendered
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedScrollPosition),
          behavior: 'instant',
        })
      }, 100)
    }
  }

  onMounted(() => {
    // First try to restore the state
    restoreState()

    // If no saved repositories, load initial data
    if (repositories.value.length === 0) {
      loadRepositories()
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    // Remove scroll event listener
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout)
    }
  })

  return {
    repositories,
    loading,
    loadRepositories,
  }
}
