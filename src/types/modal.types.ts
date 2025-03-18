import type { Component } from 'vue'

export enum ModalType {
  ERROR = 'error',
  DYNAMIC = 'dynamic',
  CONFIRMATION = 'confirmation',
}

export interface BaseModalProps {
  id: string
  type: ModalType
  title?: string
  zIndex: number
}

export interface ErrorModalProps extends BaseModalProps {
  message: string
  type: ModalType.ERROR
}

export interface DynamicModalProps extends BaseModalProps {
  component: Component
  props?: Record<string, unknown>
  type: ModalType.DYNAMIC
}

export interface ConfirmationModalProps extends BaseModalProps {
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  type: ModalType.CONFIRMATION
}

export type ModalProps = ErrorModalProps | DynamicModalProps | ConfirmationModalProps

export type ModalInput =
  | Omit<ErrorModalProps, 'id' | 'zIndex'>
  | Omit<DynamicModalProps, 'id' | 'zIndex'>
  | Omit<ConfirmationModalProps, 'id' | 'zIndex'>
