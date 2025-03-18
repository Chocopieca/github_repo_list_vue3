<template>
  <template v-for="modal in modals" :key="modal.id">
    <ErrorModal v-if="modal.type === ModalType.ERROR" v-bind="modal" />
    <ConfirmationModal v-else-if="modal.type === ModalType.CONFIRMATION" v-bind="modal" />
    <DynamicModal v-else-if="modal.type === ModalType.DYNAMIC" v-bind="modal" />
  </template>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modalStore'
import { ModalType } from '@/types/modal.types'
import ErrorModal from './ErrorModal.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import DynamicModal from './DynamicModal.vue'

const modalStore = useModalStore()
const { modals } = storeToRefs(modalStore)
</script>
