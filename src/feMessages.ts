import type { BE_Response } from './fundamentals/types'
import { DEFAULT_MESSAGE_NAME } from './fundamentals/vars'
import type { AccessorWithLatest } from '@solidjs/router'
import { createEffect, createSignal, type Signal } from 'solid-js'


export class FE_Messages {
  messages: Record<string, Signal<string[]>>


  constructor() {
    this.messages = {}
  }


  /**
   * If messages at name found, use setter, else init
   * @param value - If initial value is an array of strings we use it, if a string we'll turn into array and use it
   * @param name - Messages are grouped by name
   * @param clearOnSubmit - If on form submit should this signal reset, default to true
   */
  set(value: string[] | string, name: string = DEFAULT_MESSAGE_NAME) {
    const v = Array.isArray(value) ? value : [value]

    if (this.messages[name]) this.messages[name][1](v)
    else this.messages[name] = createSignal<string[]>(v)

    return this.messages[name]
  }


  /**
   * - IF BE responses provided => turn BE messages into FE signals
   * @param responses - Array of responses from as many createAsync() calls done
   */
  sync(responses?: AccessorWithLatest<BE_Response<any, any> | undefined>[]) {
    if (Array.isArray(responses) && responses.length) {
      createEffect(() => {
        for (let i = 0; i < responses.length; i++) {
          const messages = responses[i]?.()?.messages

          if (messages) {
            for (const name in messages) {
              this.set(messages[name], name) // set array of string into signal aray of strings
            }
          }
        }
      })
    }
  }


  /**
   * If the signal has not been gotten yet, set it, this way no matter if the set or get happens first the signal will render
   * @param name - Messages are grouped by name
   */
  get(name: string = DEFAULT_MESSAGE_NAME) {
    return this.messages[name] || this.set([], name)
  }


  /**
   * Push new value onto current array
   * Set as new array
   * @param value - Value to push to end of array
   * @param name - Messages are grouped by name
   */
  push(value: any, name: string = DEFAULT_MESSAGE_NAME) {
    let current = this.messages[name] // get current value

    if (!current) current = createSignal<string[]>([]) // if 404 init to empty array

    current[1]([ ...(current[0]() || []), value  ]) // init to empty array if falsy, join value, set signal

    this.messages[name] = current // update messages object (especially necessary if initial value is undefined)
  }


  /** Clear messages at one name */
  clear(name: string) {
    this.messages[name]?.[1]([])
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
    let key = ''

    if (res?.messages) key = 'messages'
    else if (res?.nested) key = 'nested' // valibot

    if (key) {
      for (const name in res[key]) { // loop messages from response
        if (this.messages[name]) this.messages[name][1](res[key][name]) // call setter
        else this.messages[name] = createSignal(res[key][name]) // create new signal
      }
    }
  }
}
