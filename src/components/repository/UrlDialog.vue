<template>
  <div class="space-y-3">
    <button
      @click="openUrl(repoUrl)"
      class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Repository URL
    </button>
    <button
      @click="openUrl(ownerUrl)"
      class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
    >
      Owner URL
    </button>
  </div>
</template>

<script setup lang="ts">
import { useModalFactory } from '@/composables/useModalFactory'

interface Props {
  repoUrl: string
  ownerUrl: string
  modalId: string
}

const props = withDefaults(defineProps<Props>(), {
  repoUrl: '',
  ownerUrl: '',
})

const modalFactory = useModalFactory()

const closeDialog = () => {
  modalFactory.closeModal(props.modalId)
}

const openUrl = (url: string) => {
  window.open(url, '_blank')
  closeDialog()
}
</script>
