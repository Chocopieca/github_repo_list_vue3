<script setup lang="ts">
import RepoList from '@/components/repository/RepoList.vue'
import ModalManager from '@/components/modals/ModalManager.vue'
</script>

<template>
  <div class="container">
    <h1 class="text-2xl font-bold mb-6">Node.js Repositories</h1>
    <RepoList />
    <ModalManager />
  </div>
</template>
