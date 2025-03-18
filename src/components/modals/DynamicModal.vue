<template>
  <BaseModal v-bind="modalProps">
    <component :is="props.component" v-bind="componentProps" />
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import type { DynamicModalProps } from '@/types/modal.types'

const props = defineProps<DynamicModalProps>()

const modalProps = computed(() => ({
  id: props.id,
  type: props.type,
  title: props.title,
  zIndex: props.zIndex,
}))

const componentProps = computed(() => ({
  ...(props.props || {}),
  modalId: props.id,
}))
</script>
