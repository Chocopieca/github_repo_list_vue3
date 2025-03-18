import { ref } from 'vue'
import { ErrorFactory } from '@/errors/ErrorFactory'
import { ApiError, NetworkError, BaseError, RateLimitError } from '@/errors/ApiError'
import { useModalFactory } from './useModalFactory'
import { markRaw } from 'vue'
import GithubAuthModal from '@/components/auth/GithubAuthModal.vue'

interface ErrorModalState {
  isVisible: boolean
  message: string
}

export const useErrorHandler = () => {
  const modalState = ref<ErrorModalState>({
    isVisible: false,
    message: '',
  })

  const modalFactory = useModalFactory()

  const showErrorModal = (message: string) => {
    modalState.value = {
      isVisible: true,
      message,
    }
  }

  const hideErrorModal = () => {
    modalState.value.isVisible = false
  }

  const showAuthModal = () => {
    modalFactory.showDynamic(markRaw(GithubAuthModal), {
      title: 'GitHub Authentication Required',
    })
  }

  const handleError = async (error: unknown): Promise<BaseError> => {
    const processedError = await ErrorFactory.createError(error)

    // Handle different types of errors
    if (processedError instanceof RateLimitError) {
      showAuthModal()
    } else if (processedError instanceof ApiError) {
      showErrorModal(`API Error: ${processedError.message}`)
    } else if (processedError instanceof NetworkError) {
      showErrorModal('Network Error: Please check your internet connection')
    } else {
      showErrorModal('An unexpected error occurred. Please try again later')
    }

    return processedError
  }

  return {
    handleError,
    modalState,
    showErrorModal,
    hideErrorModal,
  }
}
