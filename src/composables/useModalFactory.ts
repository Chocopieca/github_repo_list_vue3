import { useModalStore } from '@/stores/modalStore'
import type { Component } from 'vue'
import { ModalType } from '@/types/modal.types'

interface ConfirmationOptions {
  title?: string
  confirmText?: string
  cancelText?: string
  onCancel?: () => void
}

const DEFAULT_CONFIRMATION_OPTIONS: ConfirmationOptions = {
  confirmText: 'Confirm',
  cancelText: 'Cancel'
}

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
    options: ConfirmationOptions = {},
  ): string => {
    const { title, confirmText, cancelText, onCancel } = {
      ...DEFAULT_CONFIRMATION_OPTIONS,
      ...options
    }

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

  return {
    showError,
    showDynamic,
    showConfirmation,
    closeModal: (id: string): void => modalStore.closeModal(id),
    closeAllModals: (): void => modalStore.closeAllModals(),
  }
}
