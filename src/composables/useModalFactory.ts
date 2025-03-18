import { useModalStore } from '@/stores/modalStore'
import type { Component } from 'vue'
import { ModalType } from '@/types/modal.types'

export function useModalFactory() {
  const modalStore = useModalStore()

  const showError = (message: string, title?: string): string => {
    return modalStore.openModal({
      type: ModalType.ERROR,
      message,
      title,
    })
  }

  const showDynamic = (
    component: Component,
    props?: Record<string, unknown>,
    title?: string,
  ): string => {
    return modalStore.openModal({
      type: ModalType.DYNAMIC,
      component,
      props,
      title,
    })
  }

  const showConfirmation = (
    message: string,
    onConfirm: () => void,
    {
      title,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onCancel,
    }: {
      title?: string
      confirmText?: string
      cancelText?: string
      onCancel?: () => void
    } = {},
  ): string => {
    return modalStore.openModal({
      type: ModalType.CONFIRMATION,
      message,
      title,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    })
  }

  const closeModal = (id: string): void => {
    modalStore.closeModal(id)
  }

  const closeAllModals = (): void => {
    modalStore.closeAllModals()
  }

  return {
    showError,
    showDynamic,
    showConfirmation,
    closeModal,
    closeAllModals,
  }
}
