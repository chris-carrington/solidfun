/**
 * 🧚‍♀️ How to access:
 *     - import { FE, useFE } from '@solidfun/fe'
 */


import { Bits } from '../bits'
import { feFetch } from '../feFetch'
import { buildURL } from '../buildURL'
import { FEContext } from './feContext'
import { FEMessages } from '../feMessages'
import { useContext, type JSX } from 'solid-js'
import type { Params, Location } from '@solidjs/router'
import type { GET_Paths, InferGETParams, POST_Paths, InferPOSTBody, InferPOSTParams, InferGETResponse, InferPOSTResponse } from './types'


/** 
 * - Class to help
 *     - Call `api` endpoints w/ `intellisense`
 *     - Create / manage be & fe `messages`
 *     - Create / manage be & fe `loading signals`
 */
export class FE {
  params: Params 
  bits = new Bits()
  location: Location
  children?: JSX.Element
  messages = new FEMessages()


  constructor(params: Params, location: Location, children?: JSX.Element) {
    this.params = params
    this.location = location
    this.children = children
  }


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
  async POST<T extends POST_Paths>(path: T, options?: { params?: InferPOSTParams<T>, body?: InferPOSTBody<T>, bitKey?: string }): Promise<InferPOSTResponse<T>> {
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


/**
 * - Typically called when you'd love the fe object in a custom component & don't wanna prop drill
 * @example
  ```ts
  import { useFE } from '@solidfun/fe'

  export function CustomComponent() {
    const fe = useFE()
    // ...
  }
  ```
 */
export function useFE(): FE {
  const fe = useContext(FEContext)

  if (!fe) throw new Error("Please ensure useFE()` is called inside <FEContext.Provider>")

  return fe
}
