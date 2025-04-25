/**
 * 🧚‍♀️ How to access:
 *     - import { FE } from '@solidfun/fe'
 */


import { Bits } from '../bits'
import { feFetch } from '../feFetch'
import { buildURL } from '../buildURL'
import { FE_Messages } from '../feMessages'
import type { GET_Paths, InferGETParams, POST_Paths, InferPOSTBody, InferPOSTParams, InferGETResponse } from './types'


/** 
 * - Class to help
 *     - Call `api` endpoints w/ `intellisense`
 *     - Create / manage be & fe `messages`
 *     - Create / manage be & fe `loading signals`
 */
export class FE {
  bits = new Bits()
  messages = new FE_Messages()


  /**
   * Call GET w/ intellisense
   * @param path - As defined @ `new API()`
   * @param options.bitKey - `Bits` are `boolean signals`, they live in a `map`, so they each have a `bitKey` to help us identify them
   * @param options.params - Path params
   */
  async GET<T extends GET_Paths>(path: T, options?: { params?: InferGETParams<T>, bitKey?: string }): Promise<InferGETResponse<T>> {
    return this.#fetch(buildURL(path, options?.params), {method: 'GET', bitKey: options?.bitKey })
  }


  /**
   * Call POST w/ intellisense
   * @param path - As defined @ `new API()`
   * @param options.bitKey - `Bits` are `boolean signals`, they live in a `map`, so they each have a `bitKey` to help us identify them
   * @param options.params - Path params
   * @param options.body - Request body
   */
  async POST<T extends POST_Paths>(path: T, options?: { params?: InferPOSTParams<T>, body?: InferPOSTBody<T>, bitKey?: string }) {
    return this.#fetch(buildURL(path, options?.params), {method: 'POST', bitKey: options?.bitKey, body: options?.body })
  }


  async #fetch(url: string, { method, body, bitKey }: { body?: any, bitKey?: string, method: 'GET' | 'POST' }) {
    if (bitKey) this.bits.set(bitKey, true)

    const res = await feFetch(url, method, body)

    this.messages.align(res)

    if (bitKey) this.bits.set(bitKey, false)

    return res
  }
}
