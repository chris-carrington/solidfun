/**
 * 🧚‍♀️ How to access:
 *     - import { FE } from '@solidfun/fe'
 */


import { feFetch } from '../feFetch'
import { buildURL } from '../buildURL'
import { FE_Messages } from '../feMessages'
import { createSignal, type Signal } from 'solid-js'
import type { GET_Paths, GET_Params, POST_Paths, POST_Body, POST_Params } from './types'


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


  async GET<T extends GET_Paths>(path: T, options?: { params?: GET_Params<T>, loadKey?: string }) {
    return this.#fetch(buildURL(path, options?.params), {method: 'GET', loadKey: options?.loadKey })
  }


  async POST<T extends POST_Paths>(path: T, options?: { params?: POST_Params<T>, body?: POST_Body<T>, loadKey?: string }) {
    return this.#fetch(buildURL(path, options?.params), {method: 'POST', loadKey: options?.loadKey, body: options?.body })
  }

  
  setLoading(loadKey: string, value: boolean) {
    if (this.loadSignals[loadKey]) this.loadSignals[loadKey][1](value)
    else this.loadSignals[loadKey] = createSignal(value)
  }



  getLoading(loadKey: string) {
    if (!this.loadSignals[loadKey]) this.loadSignals[loadKey] = createSignal(false)
    return this.loadSignals[loadKey] // return the accessor value
  }
}
