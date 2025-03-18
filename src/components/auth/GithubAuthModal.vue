<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()

const handleGithubAuth = () => {
  // GitHub OAuth URL with required scopes
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
  const redirectUri = `${window.location.origin}/auth/callback`
  const scope = 'repo'

  // Add state parameter for security
  const state = Math.random().toString(36).substring(7)
  localStorage.setItem('github_auth_state', state)

  const authUrl = new URL('https://github.com/login/oauth/authorize')
  authUrl.searchParams.append('client_id', clientId)
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('scope', scope)
  authUrl.searchParams.append('state', state)

  window.location.href = authUrl.toString()
}
</script>

<template>
  <div class="p-6">
    <h2 class="text-black text-xl font-bold mb-4">{{ title }}</h2>
    <p class="text-black mb-6">
      You've reached the GitHub API rate limit. Please authenticate with GitHub to increase your
      rate limit.
    </p>
    <button
      @click="handleGithubAuth"
      class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
    >
      Authenticate with GitHub
    </button>
  </div>
</template>
