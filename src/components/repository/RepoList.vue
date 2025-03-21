<script setup lang="ts">
import RepoCard from '@/components/repository/RepoCard.vue'
import { useRepositoryList } from '@/composables/useRepositoryList'
import { vInfiniteScroll } from '@/directives'

const { repositories, loading, loadRepositories } = useRepositoryList()
</script>

<template>
  <div
    class="repositories-list"
    v-infinite-scroll="{
      onLoadMore: loadRepositories,
      disabled: loading,
      threshold: 200,
    }"
  >
    <div v-if="repositories.length === 0" class="empty-list">
      <span>No repositories found</span>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="repo in repositories" :key="repo.id">
        <RepoCard :repository="repo" />
      </div>
    </div>

    <div v-if="loading" class="loading-indicator">
      <span>Loading more repositories...</span>
    </div>
  </div>
</template>

<style scoped>
.repositories-list {
  padding: 1rem;
}

.loading-indicator {
  text-align: center;
  padding: 1rem;
  color: #666;
}
</style>
