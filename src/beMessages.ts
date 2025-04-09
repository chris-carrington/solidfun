import { DEFAULT_MESSAGE_NAME } from './pub/vars'
import type { BE_Messages_Response } from './pub/types'


/**
 * On the BE messages are: `Record<string, string[]>`
 */
export class BE_Messages {
  messages: BE_Messages_Response


  constructor() {
    this.messages = {}
  }


  catch(e: any) {
    if (typeof e === 'string') this.push(e)
    else if (typeof e?.message === 'string') this.push(e.message)
    else this.push('An error has occurred')
  }


  push(message: string, name: string = DEFAULT_MESSAGE_NAME) {
    if (!this.messages[name]) this.messages[name] = []
    this.messages[name].push(message)
  }


  get() {
    return this.messages
  }


  has() {
    return Boolean(Object.keys(this.messages).length > 0)
  }
}
