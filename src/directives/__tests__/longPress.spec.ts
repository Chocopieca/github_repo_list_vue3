import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { vLongPress } from '../longPress'
import type { DirectiveBinding, ObjectDirective, VNode, RendererNode } from 'vue'
import type { LongPressOptions } from '../longPress'

// Create a mock VNode that matches the directive's requirements
const createMockVNode = () =>
  ({
    el: document.createElement('div'),
    type: 'element',
    component: null,
    key: null,
    ref: null,
    props: {},
    children: null,
  }) as unknown as VNode<RendererNode, HTMLElement>

describe('vLongPress directive', () => {
  let el: HTMLElement
  let binding: DirectiveBinding<LongPressOptions>
  let onLongPress: () => void
  let vnode: VNode<RendererNode, HTMLElement>

  beforeEach(() => {
    // Setup DOM element
    el = document.createElement('div')

    // Setup mock callback
    onLongPress = vi.fn()

    // Setup mock VNode
    vnode = createMockVNode()

    // Setup directive binding
    binding = {
      value: {
        onLongPress,
        delay: 500,
      },
      modifiers: {},
      oldValue: null,
      arg: '',
      instance: null,
      dir: {} as ObjectDirective<HTMLElement, LongPressOptions>,
    } as DirectiveBinding<LongPressOptions>

    // Mock timers
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should mount and unmount without errors', () => {
    expect(() => {
      ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
        el,
        binding,
        vnode,
        null,
      )
      ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).unmounted?.(
        el,
        binding,
        vnode,
        null,
      )
    }).not.toThrow()
  })

  it('should warn if onLongPress is not a function', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    binding.value = {} as LongPressOptions
    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
      el,
      binding,
      vnode,
      null,
    )

    expect(consoleSpy).toHaveBeenCalledWith(
      'v-long-press directive requires an onLongPress function',
    )
  })

  it('should trigger long press after default delay', async () => {
    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
      el,
      binding,
      vnode,
      null,
    )

    // Trigger mousedown
    el.dispatchEvent(new MouseEvent('mousedown'))

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPress).toHaveBeenCalledTimes(1)
  })

  it('should trigger long press after custom delay', async () => {
    binding.value = {
      onLongPress,
      delay: 1000,
    }
    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
      el,
      binding,
      vnode,
      null,
    )

    // Trigger mousedown
    el.dispatchEvent(new MouseEvent('mousedown'))

    // Check that it hasn't triggered before delay
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPress).not.toHaveBeenCalled()

    // Check that it triggers after full delay
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPress).toHaveBeenCalledTimes(1)
  })

  it('should cancel long press on mouse up', async () => {
    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
      el,
      binding,
      vnode,
      null,
    )

    // Start press
    el.dispatchEvent(new MouseEvent('mousedown'))

    // Cancel before delay
    el.dispatchEvent(new MouseEvent('mouseup'))

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('should cancel long press on mouse leave', async () => {
    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
      el,
      binding,
      vnode,
      null,
    )

    // Start press
    el.dispatchEvent(new MouseEvent('mousedown'))

    // Move mouse out
    el.dispatchEvent(new MouseEvent('mouseleave'))

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('should handle touch events', async () => {
    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
      el,
      binding,
      vnode,
      null,
    )

    // Start touch
    el.dispatchEvent(new TouchEvent('touchstart'))

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPress).toHaveBeenCalledTimes(1)
  })

  it('should cancel on touch end', async () => {
    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
      el,
      binding,
      vnode,
      null,
    )

    // Start touch
    el.dispatchEvent(new TouchEvent('touchstart'))

    // End touch before delay
    el.dispatchEvent(new TouchEvent('touchend'))

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('should ignore non-left mouse buttons', async () => {
    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
      el,
      binding,
      vnode,
      null,
    )

    // Trigger right mousedown
    el.dispatchEvent(new MouseEvent('mousedown', { button: 2 }))

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('should clean up event listeners on unmount', () => {
    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).mounted?.(
      el,
      binding,
      vnode,
      null,
    )

    const removeEventListenerSpy = vi.spyOn(el, 'removeEventListener')

    ;(vLongPress as ObjectDirective<HTMLElement, LongPressOptions>).unmounted?.(
      el,
      binding,
      vnode,
      null,
    )

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(6) // 3 mouse events + 3 touch events
  })
})
