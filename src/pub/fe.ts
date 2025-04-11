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
 *     - Get form data values
 *     - Create / manage signal errors if they arise @ form and/or api call
 */
export class FE {
  messages: FE_Messages
  #formData: FormData | undefined
  load: {
    signal?: Signal<boolean>
  }


  constructor() {
    this.load = {}
    this.messages = new FE_Messages()
  }


  async GET <T extends GET_Paths>(path: T, options?: { params?: GET_Params<T> }) {
    const res = await feFetch(buildURL(path, options?.params))
    this.catch(res)
    return res
  }


  async POST <T extends POST_Paths>(path: T, options?: { params?: POST_Params<T>, body?: POST_Body<T> }) {
    const res = await feFetch(buildURL(path, options?.params), 'POST', options?.body)
    this.catch(res)
    return res
  }


  /**
   * - Event prevent default
   * - Set formData instance variable to be used via `this.fd()`
   * - Set loading to true
   * - Clear all previous messages
   * @param evt - SubmitEvent (browser onSubmit event)
   */
  onSubmitInit(evt: SubmitEvent) {
    evt.preventDefault()
    this.setLoading(true)
    this.messages.clearAll()
    this.#formData = new FormData(evt.currentTarget as HTMLFormElement)
  }


  /**
   * Helper to extract values from form by accessing the forms form data
   * @param name - Name attribute value for input in form
   * @param cast - What the value from the form should be cast to
   * @returns - The casted value from form data
   */
  fd <T extends 'string' | 'number' | 'boolean' | 'img' = 'string'>(name: string, cast?: T): 
  T extends 'number' ? number :
  T extends 'boolean' ? boolean :
  T extends 'img' ? File :
  string {
    const res = this.#formData?.get(name)

    switch(cast) {
      case 'number': return Number(res) as any
      case 'boolean': return Boolean(res) as any
      case 'img': return (res instanceof File && res.type.startsWith('image/')) ? res as any : null as any
      default: return String(res) as any
    }
  }


  /**
   * From the component perspective called on catch, but also called at the end of this.#fetch too
   * if the response has a redirect it'll go to it, sets isLoading to false and aligns response messages with signals
   * @param res 
   */
  catch(res: any) {
    this.setLoading(false)
    this.messages.catch(res)
  }


  
  setLoading (value: boolean) {
    if (this.load.signal) this.load.signal[1](value)
    else this.load.signal = createSignal(value)
  }



  getLoading () {
    if (!this.load.signal) this.load.signal = createSignal(false)
    return this.load.signal // return the accessor value
  }
}
