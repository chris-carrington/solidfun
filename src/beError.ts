import type { JSON_Response, JSONResponseMessages } from './fundamentals/types'


export class BE_Error {
  message?: string
  status?: number
  rawBody?: string
  statusText?: string
  messages?: JSONResponseMessages


  constructor({ status = 400, statusText, message, messages, rawBody }: {  status?: number, statusText?: string, message?: string,messages?: JSONResponseMessages, rawBody?: string }) {
    this.status = status
    this.message = message
    this.rawBody = rawBody
    this.messages = messages
    this.statusText = statusText
  }


  /**
   * - Typically called in the catch block of a try / cactch
   * @param options `{ error, data, defaultMessage = '❌ Sorry but an error just happened' }`
   */
  static catch<T>(options?: { error?: any, data?: any, defaultMessage?: string }): JSON_Response<T>  {
    let res: JSON_Response<T> | undefined

    if (options?.error) {
      if (options.error instanceof BE_Error) res = options.error.#get<T>(options.data)
      else if (options.error instanceof Error) res = BE_Error.#simple(options.error.message)
      else if (typeof options.error === 'string') res = BE_Error.#simple(options.error)      
    }

    if (!res) res = BE_Error.#simple('❌ Sorry but an error just happened')

    return res
  }


  #get<T extends any>(data?: T): JSON_Response {
    const res: JSON_Response = { data }

    if (this.status || this.statusText || this.message || this.messages || this.rawBody) {
      res.error = {}

      if (this.status) res.error.status = this.status
      if (this.statusText) res.error.statusText = this.statusText
      if (this.message) res.error.message = this.message
      if (this.messages) res.error.messages = this.messages
      if (this.rawBody) res.error.rawBody = this.rawBody
    }

    return res
  }


  static #simple(message: string, status: number = 400): JSON_Response {
    return { error: { status, message } }
  }
}
