<template>
  <BaseModal v-bind="$props">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ message }}</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import type { ErrorModalProps } from '@/types/modal.types'

defineProps<ErrorModalProps>()
</script>

<style scoped>
.error-content {
  text-align: center;
  padding: 20px 0;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.error-message {
  color: #dc3545;
  margin: 0;
  font-size: 1.1rem;
}
</style>
