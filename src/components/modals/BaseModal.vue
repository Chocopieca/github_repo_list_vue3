<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="props.id"
        class="modal-overlay"
        :style="{ zIndex: props.zIndex }"
        @click="closeModal"
      >
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 v-if="props.title" class="modal-title">{{ props.title }}</h3>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          <div class="modal-content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useModalFactory } from '@/composables/useModalFactory'
import type { BaseModalProps } from '@/types/modal.types'

const props = defineProps<BaseModalProps>()
const modalFactory = useModalFactory()

const closeModal = () => {
  modalFactory.closeModal(props.id)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.modal-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  min-width: 300px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: #666;
}

.modal-close:hover {
  color: #000;
}

.modal-content {
  margin-top: 10px;
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
