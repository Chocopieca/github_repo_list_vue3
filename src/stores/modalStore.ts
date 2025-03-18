import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ModalProps, ModalInput } from '@/types/modal.types'

export const useModalStore = defineStore('modal', () => {
  const modals = ref<ModalProps[]>([])

  const isAnyModalOpen = computed(() => modals.value.length > 0)

  watch(isAnyModalOpen, (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })

  function openModal(modal: ModalInput): string {
    const id = crypto.randomUUID()
    const zIndex = 1000 + modals.value.length

    const newModal: ModalProps = {
      ...modal,
      id,
      zIndex,
    }

    modals.value.push(newModal)

    return id
  }

  function closeModal(id: string) {
    const index = modals.value.findIndex((modal) => modal.id === id)
    if (index !== -1) {
      modals.value.splice(index, 1)
    }
  }

  function closeAllModals() {
    modals.value = []
  }

  return {
    modals,
    isAnyModalOpen,
    openModal,
    closeModal,
    closeAllModals,
  }
})
