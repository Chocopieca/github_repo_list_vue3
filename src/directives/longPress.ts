import type { Directive, DirectiveBinding } from 'vue'

export interface LongPressOptions {
  delay?: number
  onLongPress: () => void
}

interface ExtendedHTMLElement extends HTMLElement {
  _longPressStart?: (e: Event) => void
  _longPressCancel?: () => void
}

export const vLongPress: Directive = {
  mounted(el: ExtendedHTMLElement, binding: DirectiveBinding<LongPressOptions>) {
    if (typeof binding.value?.onLongPress !== 'function') {
      console.warn('v-long-press directive requires an onLongPress function')
      return
    }

    const delay = binding.value?.delay || 500
    let pressTimer: number | null = null

    const start = (e: Event) => {
      if (e instanceof MouseEvent && e.button !== 0) {
        return
      }

      if (pressTimer === null) {
        pressTimer = window.setTimeout(() => {
          binding.value.onLongPress()
        }, delay)
      }
    }

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    el._longPressStart = start
    el._longPressCancel = cancel

    el.addEventListener('mousedown', start)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)

    el.addEventListener('touchstart', start)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  },

  unmounted(el: ExtendedHTMLElement) {
    if (el._longPressStart && el._longPressCancel) {
      el.removeEventListener('mousedown', el._longPressStart)
      el.removeEventListener('mouseup', el._longPressCancel)
      el.removeEventListener('mouseleave', el._longPressCancel)
      el.removeEventListener('touchstart', el._longPressStart)
      el.removeEventListener('touchend', el._longPressCancel)
      el.removeEventListener('touchcancel', el._longPressCancel)
    }
  },
}
