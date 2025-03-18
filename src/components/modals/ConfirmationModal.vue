<template>
  <BaseModal v-bind="$props">
    <div class="confirmation-content">
      <p class="confirmation-message">{{ message }}</p>
      <div class="confirmation-actions">
        <button class="btn btn-secondary" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="btn btn-primary" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useModalFactory } from '@/composables/useModalFactory'
import BaseModal from './BaseModal.vue'
import type { ConfirmationModalProps } from '@/types/modal.types'

const props = defineProps<ConfirmationModalProps>()

const modalFactory = useModalFactory()

const handleConfirm = () => {
  props.onConfirm()
  modalFactory.closeModal(props.id)
}

const handleCancel = () => {
  props.onCancel?.()
  modalFactory.closeModal(props.id)
}
</script>

<style scoped>
.confirmation-content {
  text-align: center;
  padding: 20px 0;
}

.confirmation-message {
  margin: 0 0 20px;
  font-size: 1.1rem;
}

.confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>
