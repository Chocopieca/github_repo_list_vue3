import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGithubAuthStore = defineStore('githubAuth', () => {
  const token = ref<string | null>(localStorage.getItem('github_token'))

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('github_token', newToken)
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem('github_token')
  }

  return {
    token,
    setToken,
    clearToken,
  }
})
