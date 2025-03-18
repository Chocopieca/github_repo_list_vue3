<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGithubAuthStore } from '@/stores/githubAuth'

const router = useRouter()
const authStore = useGithubAuthStore()

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  const savedState = localStorage.getItem('github_auth_state')

  // Clear saved state
  localStorage.removeItem('github_auth_state')

  // Verify state to prevent CSRF attacks
  if (!state || state !== savedState) {
    console.error('Invalid state parameter')
    router.push('/')
    return
  }

  if (code) {
    try {
      // Exchange the code for an access token using our proxy
      const tokenResponse = await fetch('/github-oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
          client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
          code,
        }),
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        throw new Error(`Failed to exchange code for token: ${errorText}`)
      }

      const data = await tokenResponse.json()

      if (data.error) {
        throw new Error(data.error_description || data.error)
      }

      authStore.setToken(data.access_token)

      // Redirect back to the main page
      router.push('/')
    } catch (error) {
      console.error('Failed to exchange code for token:', error)
      router.push('/')
    }
  } else {
    // No code present, redirect to home
    router.push('/')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h2 class="text-xl font-bold mb-4">Authenticating...</h2>
      <p class="text-gray-600">Please wait while we complete the authentication process.</p>
    </div>
  </div>
</template>
