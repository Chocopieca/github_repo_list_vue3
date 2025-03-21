<script setup lang="ts">
import { useModalFactory } from '@/composables/useModalFactory'
import UrlDialog from './UrlDialog.vue'
import { markRaw, computed } from 'vue'
import type { ExtendedGithubRepository } from '@/services/github/types'

interface Props {
  repository: ExtendedGithubRepository
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
  <div :class="cardClasses" class="text-black h-full" v-long-press="{ onLongPress: handleLongPress, delay: 500 }">
    <div class="flex justify-between">

    </div>
    <p v-if="description" class="mb-3">{{ description }}</p>
    <div class="flex items-center text-sm">
      <span class="mr-2">Owner:</span>
      <span class="font-medium">{{ repository.owner.login }}</span>
    </div>
    <div class="flex items-center text-sm">
      <span class="mr-2">Subscribers:</span>
      <span class="font-medium">{{ repository.subscribers_count }}</span>
    </div>
  </div>
</template>
