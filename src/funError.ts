import type { JSONResponse, FlatMessages } from './fundamentals/types'


/**
 * - Supports `valibot` messages
 * - Supports errors where we don't wanna parse the json
 * - Helpful when we wanna throw an error from one place get it in another, who knows how it was parsed, but stay simple w/ json and get the error info we'd love to know
 */
export class FunError {
  isFunError = true
  message?: string
  status?: number
  rawBody?: string
  statusText?: string
  messages?: FlatMessages


  constructor({ status = 400, statusText, message, messages, rawBody }: {  status?: number, statusText?: string, message?: string,messages?: FlatMessages, rawBody?: string }) {
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
  static catch<T>(options?: { error?: any, data?: any, defaultMessage?: string }): JSONResponse<T>  {
    let res: JSONResponse<T> | undefined

    if (options?.error) {
      if (options.error instanceof FunError) res = options.error.#get<T>(options.data)
      else if (options.error instanceof Error) res = FunError.#simple(options.error.message)
      else if (typeof options.error === 'string') res = FunError.#simple(options.error)      
    }

    if (!res) res = FunError.#simple('❌ Sorry but an error just happened')

    return res
  }


  #get<T extends any>(data?: T): JSONResponse {
    const res: JSONResponse = { data, error: null }

    if (this.status || this.statusText || this.message || this.messages || this.rawBody) {
      res.error = { isFunError: true }

      if (this.status) res.error.status = this.status
      if (this.statusText) res.error.statusText = this.statusText
      if (this.message) res.error.message = this.message
      if (this.messages) res.error.messages = this.messages
      if (this.rawBody) res.error.rawBody = this.rawBody
    }

    return res
  }


  static #simple(message: string, status: number = 400): JSONResponse {
    return { data: null, error: { isFunError: true, status, message } }
  }
}
