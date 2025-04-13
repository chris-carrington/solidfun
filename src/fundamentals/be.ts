/**
 * 🧚‍♀️ How to access:
 *     - import { BE } from '@solidfun/be'
 */


import { BE_Messages } from '../beMessages'
import type { MessagesResponse, DataMessagesResponse, JSONResponse, VoidResponse } from './types'



/** 
 * - Class to help
 *     - Aggregate multiple message and/or errors
 *     - So there's no reason why you couldn't respond w/ just data, just errors, or a mixture of both
 *     - Respond w/ formatted errors after a server catch
 *     - Format messages in a way that works well w/ the `<Messages />` and `<Toast />` components
 */
export class BE {
  messages: BE_Messages


  constructor () {
    this.messages = new BE_Messages()
  }


  /** Send errors to messages catch and respond */
  catch (e: any) {
    this.messages.catch(e)
    return this.res(null) as MessagesResponse
  }


  /**
   * Respond with some json data
   * If you'd love to send additional w/ the response like a redirect or messages call this.res()
   */
  json<T>(value: T) {
    return this.res(value) as JSONResponse<T>
  }


  /**
   * Respond to the user
   * @param data The data we'd like to respond with
   * @returns Also adds any redirect or messages
   */
  res<T>(data: T) {
    let res

    // all
    if (data && this.messages.has()) res = { data, messages: this.messages.get() } as DataMessagesResponse<T>

    // singles
    else if (data) res = { data } as JSONResponse<T>
    else if (this.messages.has()) res = { messages: this.messages.get()} as MessagesResponse

    // void
    else if (!res) res = {} as VoidResponse

    return res
  }
}
