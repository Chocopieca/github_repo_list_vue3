import type { Directive, DirectiveBinding } from 'vue'

interface InfiniteScrollHTMLElement extends HTMLElement {
  _infiniteScrollHandler?: () => void
}

export interface InfiniteScrollOptions {
  onLoadMore: () => void
  threshold?: number
  disabled?: boolean
}

const defaultOptions: Partial<InfiniteScrollOptions> = {
  threshold: 200,
  disabled: false,
}

const handleScroll = (binding: DirectiveBinding<InfiniteScrollOptions>) => {
  const options = { ...defaultOptions, ...binding.value }

  if (options.disabled) return

  const scrollPosition = window.innerHeight + window.scrollY
  const threshold = document.documentElement.scrollHeight - (options.threshold || 0)

  if (scrollPosition >= threshold) {
    options.onLoadMore()
  }
}

export const vInfiniteScroll: Directive<InfiniteScrollHTMLElement, InfiniteScrollOptions> = {
  mounted(el, binding) {
    const handler = () => handleScroll(binding)
    el._infiniteScrollHandler = handler
    window.addEventListener('scroll', handler)
  },

  updated(el, binding) {
    if (el._infiniteScrollHandler) {
      window.removeEventListener('scroll', el._infiniteScrollHandler)
    }
    const handler = () => handleScroll(binding)
    el._infiniteScrollHandler = handler
    window.addEventListener('scroll', handler)
  },

  unmounted(el) {
    if (el._infiniteScrollHandler) {
      window.removeEventListener('scroll', el._infiniteScrollHandler)
      delete el._infiniteScrollHandler
    }
  },
}
