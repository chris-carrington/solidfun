/**
 * 🧚‍♀️ How to access:
 *     - import { FE } from '@solidfun/fe'
 */


import { feFetch } from '../feFetch'
import { buildURL } from '../buildURL'
import { FE_Messages } from '../feMessages'
import { createSignal, type Signal } from 'solid-js'
import type { GET_Paths, InferGETParams, POST_Paths, InferPOSTBody, InferPOSTParams, InferGETResponse } from './types'


/** 
 * - Class to help
 *     - Call api endpoints w/ intellisense
 *     - Create / manage be & fe messages
 *     - Create / manage be & fe loading signals
 */
export class FE {
  messages: FE_Messages
  loadSignals: Record<string, Signal<boolean>>


  constructor() {
    this.loadSignals = {}
    this.messages = new FE_Messages()
  }


  async #fetch(url: string, { method, body, loadKey }: { body?: any, loadKey?: string, method: 'GET' | 'POST' }) {
    if (loadKey) this.setLoading(loadKey, true)

    const res = await feFetch(url, method, body)
    this.messages.catch(res)

    if (loadKey) this.setLoading(loadKey, false)

    return res
  }


  async GET<T extends GET_Paths>(path: T, options?: { params?: InferGETParams<T>, loadKey?: string }): Promise<InferGETResponse<T>> {
    return this.#fetch(buildURL(path, options?.params), {method: 'GET', loadKey: options?.loadKey })
  }


  async POST<T extends POST_Paths>(path: T, options?: { params?: InferPOSTParams<T>, body?: InferPOSTBody<T>, loadKey?: string }) {
    return this.#fetch(buildURL(path, options?.params), {method: 'POST', loadKey: options?.loadKey, body: options?.body })
  }

  
  /**
   * Set signal value for a loadKey
   * @param loadKey - Loading spinners on a page each have a signal to determine if they are visible or not and a key to identify them
   * @param value - Set the value to this
   */
  setLoading(loadKey: string, value: boolean) {
    if (this.loadSignals[loadKey]) this.loadSignals[loadKey][1](value)
    else this.loadSignals[loadKey] = createSignal(value)
  }



  /**
   * - Get the current loading value by loadKey
   * - If there is not a signal already for this load key, a signal will be created for this load key and it will default to false
   * @param loadKey - Loading spinners on a page each have a signal to determine if they are visible or not and a key to identify them
   */
  isLoading(loadKey: string): boolean {
    if (!this.loadSignals[loadKey]) this.loadSignals[loadKey] = createSignal(false)
    return this.loadSignals[loadKey][0]()
  }
}
