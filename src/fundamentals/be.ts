/**
 * 🧚‍♀️ How to access:
 *     - import { BE } from '@solidfun/be'
 */


import { go as _go } from './go'
import { BEMessages } from '../beMessages'
import { APIEvent } from '@solidjs/start/server'
import type { JSONResponse, Routes, InferRouteParams, GoResponse, APIBody, URLSearchParams, URLParams } from './types'



/** 
 * - Class to help
 *     - Do a redirect w/ autocomplete
 *     - Get current request event, body and/or params
 *     - Respond w/ a consistent shape
 *     - Access BEMessages which we can push to & sync w/ fe signals
 */
export class BE<T_Params extends URLParams = {}, T_Search extends URLSearchParams = {}, T_Body extends APIBody = {}> {
  event: APIEvent
  #params: T_Params
  messages: BEMessages


  constructor(event: APIEvent, params: T_Params) {
    this.event = event
    this.#params = params
    this.messages = new BEMessages()
  }


  /**
   * - Wraps "@solidjs/router" `redirect()`
   * - Provides intellisense to current routes
   * - same as `go()` that is typically used @ `b4()`
   */
  go: <T extends Routes>(path: T, params?: InferRouteParams<T>) => GoResponse = _go


  /**
   * - Typically called when you'd love to respond from the api w/ json
   * - Will also add any messages to an errors object if you called be.message.push() during this call
   * - If you'd rather respond w/ an error and no data `throw new Error()`
   * @param data - The data to respond w/
   * @returns An object that has `{ data }` and also too some errors or messages
   */
  json<T>(data: T): JSONResponse<T> {
    let res: JSONResponse<T> = { data: null, error: null }

    if (data) res.data = data

    if (this.messages.has()) {
      res.error = {
        isFunError: true,
        messages: this.messages.get()
      }
    }

    return res
  }


  /** @returns Current request body via `await event.request.json()`  */
  async getBody() {
    return await this.event.request.json() as T_Body
  }


  /** @returns The url params object  */
  getParams() {
    return this.#params
  }
}
