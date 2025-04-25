import { createSignal, type Signal } from 'solid-js'
import { DEFAULT_MESSAGE_NAME } from './fundamentals/vars'


/**
 * - String Array Signal Management! 👷‍♀️
 *     - In `valibot` / `zod`, messages are `Record<string, string[]>`
 *     - On the `BE` messages are: `Record<string, string[]>`
 *     - On the `FE` messages are: `Map<string, Signal<string[]>>`
 */
export class FE_Messages {
  #messages: Map<string, Signal<string[]>> = new Map()


  /**
   * @param value - Value to set onto
   * @param name - Messages are grouped by name
   * @param clearOnSubmit - If on form submit should this signal reset, default to true
   */
  set({ name, value = DEFAULT_MESSAGE_NAME }: { value: string | string[], name: string }): Signal<string[]> {
    let signal$ = this.#messages.get(name)
    const v = Array.isArray(value) ? value : [value]

    if (signal$) signal$[1](v)
    else {
      signal$ = createSignal(v)
      this.#messages.set(name, signal$)
    }

    return signal$
  }
  


  /**
   * If the signal has not been gotten yet, set it, this way no matter if the set or get happens first the signal will render
   * @param name - Messages are grouped by name
   */
  get(name: string = DEFAULT_MESSAGE_NAME): Signal<string[]> {
    const current$ = this.#messages.get(name)
    return (current$) ? current$ : this.clear(name)
  }


  /**
   * @param value - If `value` is an array => concat `value` w/ `#messages`, if `value` is a `string` => push `value` onto `#messages`
   * @param name - Messages are grouped by name
   */
  push({ name, value = DEFAULT_MESSAGE_NAME }: { value: string | string[], name: string }): void {
    const [current, setCurent] = this.get(name)

    if (Array.isArray(value)) setCurent(current().concat(value))
    else setCurent([ ...current(), value ])
  }


  /** 
   * - Reset
   * - Clear messages at one name
   * - May also be used to init messages at a name
   */
  clear(name: string): Signal<string[]> {
    return this.set({ name, value: [] })
  }


  /** Clear all messages */
  clearAll() {
    for (const name in this.#messages) {
      this.clear(name)
    }
  }


  /**
   * - Align `res.messages` with signals (from)
   * - Align `res.message` with signals (from `feFetch()`)
   * @param res - Response from server of type `JSON_Response` or atleast has a `Record<string, string[]>` @ `res.error.messages`
   */
  align(res: any) {
    // res.messages
    if (res && res?.messages && typeof res.messages === 'object') {
      for (const name in res.messages) { // messages are grouped by name
        const signal$ = this.#messages.get(name)

        if (signal$) signal$[1](res.messages[name]) // call setter
        else this.set({ name, value: res.messages[name] })
      }
    }

    // res.message
    if (res && res?.message && typeof res.message == 'string') {
      const signal$ = this.#messages.get(DEFAULT_MESSAGE_NAME)

      if (signal$) signal$[1]([res.message]) // call setter
      else this.set({ name: DEFAULT_MESSAGE_NAME, value: res.message })
    }
  }
}
