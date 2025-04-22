import { createSignal, type Signal } from 'solid-js'
import { DEFAULT_MESSAGE_NAME } from './fundamentals/vars'


/**
 * - In `valibot` / `zod`, messages are `[string, string[]][]`
 * - On the `BE` messages are: `Map<string, string[]>`
 * - On the `FE` messages are: `Map<string, Signal<string[]>>`
 */
export class FE_Messages {
  messages: Map<string, Signal<string[]>>


  constructor() {
    this.messages = new Map()
  }


  /**
   * @param value - If array => set, if a string => set, If wanna push call `this.push()`
   * @param name - Messages are grouped by name
   * @param clearOnSubmit - If on form submit should this signal reset, default to true
   */
  set({ name, value = DEFAULT_MESSAGE_NAME }: { value: string | string[], name: string }): string[] {
    const [current, setCurrent] = this.messages.get(name) || createSignal<string[]>([])
    setCurrent(Array.isArray(value) ? value : [value])
    return current()
  }
  


  /**
   * If the signal has not been gotten yet, set it, this way no matter if the set or get happens first the signal will render
   * @param name - Messages are grouped by name
   */
  get(name: string = DEFAULT_MESSAGE_NAME): string[] {
    const current$ = this.messages.get(name)
    return (current$) ? current$[0]() : this.clear(name)
  }


  /**
   * @param value - If array => push, if a string => push, If wanna set call `this.set()`
   * @param name - Messages are grouped by name
   */
  push({ name, value = DEFAULT_MESSAGE_NAME }: { value: string | string[], name: string }): void {
    const current = this.get(name)

    if (Array.isArray(value)) this.set({ name, value: current.concat(value) })
    else current.push(value)
  }


  /** 
   * - Reset
   * - Clear messages at one name
   * - May also be used to init messages at a name
   */
  clear(name: string): string[] {
    return this.set({ name, value: [] })
  }


  /** Clear all messages */
  clearAll() {
    for (const name in this.messages) {
      this.clear(name)
    }
  }


  /**
   * Align response messages with signals
   * @param res - Response from server
   */
  catch(res: any) {
    if (res && res?.error && Array.isArray(res.error?.messages)) {
      for (const name of res.error?.messages) { // messages are grouped by name
        const current$ = this.messages.get(name)

        if (current$) current$[1](res.error?.messages[name]) // call setter
        else this.messages.set(name, createSignal(res.error?.messages[name])) // create new signal
      }
    }
  }
}
