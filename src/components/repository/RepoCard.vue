<script setup lang="ts">
import { useModalFactory } from '@/composables/useModalFactory'
import UrlDialog from './UrlDialog.vue'
import { markRaw, computed } from 'vue'
import type { GithubRepository } from '@/types/github.types'

interface Props {
  repository: GithubRepository
}

const props = defineProps<Props>()
const modalFactory = useModalFactory()

const cardClasses = computed(() => ({
  'p-4 rounded-lg shadow-md mb-4 transition-colors cursor-pointer': true,
  'bg-blue-50': !props.repository.has_wiki,
  'bg-white': props.repository.has_wiki,
}))

const modalConfig = computed(() => ({
  repoUrl: props.repository.html_url,
  ownerUrl: props.repository.owner.html_url,
  title: 'Choose URL to open',
}))

const handleLongPress = () => {
  modalFactory.showDynamic(markRaw(UrlDialog), modalConfig.value)
}

const description = computed(() => props.repository.description || '')
</script>

<template>
  <div :class="cardClasses" v-long-press="{ onLongPress: handleLongPress, delay: 500 }">
    <h2 class="text-xl font-bold text-gray-800 mb-2">{{ repository.name }}</h2>
    <p v-if="description" class="text-gray-600 mb-3">{{ description }}</p>
    <div class="flex items-center text-sm text-gray-500">
      <span class="mr-2">Owner:</span>
      <span class="font-medium">{{ repository.owner.login }}</span>
    </div>
  </div>
</template>
