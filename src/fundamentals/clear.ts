/**
 * 🧚‍♀️ How to access:
 *     - import { clear } from '@solidfun/clear'
 */


import { FE_Context } from './feContext'
import { onCleanup, useContext } from 'solid-js'


/**
 * When an input has triggered the input event, clear the messages for this input, smartly
 * @param el - Element html input
 * @param value
 */
export function clear(el: HTMLInputElement) {
  const fe = useContext(FE_Context)
  let readyToClear = true

  function onBlur () {
    readyToClear = true
  }

  function onInput () {
    if (readyToClear) {
      readyToClear = false
      fe.messages.set({ name: el.name, value: [] })
    }
  }

  el.addEventListener('blur', onBlur)
  el.addEventListener('input', onInput)

  onCleanup(() => {
    el.removeEventListener('blur', onBlur)
    el.removeEventListener('input', onInput)
  })
}

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clear: true
    }
  }
}
