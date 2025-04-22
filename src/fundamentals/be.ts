/**
 * 🧚‍♀️ How to access:
 *     - import { BE } from '@solidfun/be'
 */


import { BE_Messages } from '../beMessages'
import type { JSON_Response } from './types'



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


  /**
   * - Whenever there is a random error on the serer Solid Fun will respond w/ an error in this shape
   * - So if you'd love a common shape between data & errors use this function
   * - & then you could do things in templates like: `{ res()?.error?.message || res()?.data?.character }`
   * - 🚨 If any messages have been pushed to be.messages, they will appear @ res.error.messages when calling this function
   * @param data - The data to respond w/
   * @returns An object that has `{ data }` and also too some errors or messages
   */
  json<T>(data: T): JSON_Response<T> {
    let res = {}

    if (data && this.messages.has()) { // data & messages
      res = {
        data,
        error: { messages: this.messages.get() }
      }
    } 
    else if (data) res = { data } // just data
    else if (this.messages.has()) res = { messages: this.messages.get() } // just messages

    return res
  }
}
