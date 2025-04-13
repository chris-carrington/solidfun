/**
 * 🧚‍♀️ How to access:
 *     - import { API } from '@solidfun/api'
 *     - import type { APIArgs, APIOptions, APIFn, APIFnArgs } from '@solidfun/api'
 */


import type { BE } from './be'
import type { B4, APIEvent } from './types'
import { pathnameToPattern } from './pathnameToPattern'


export type APIArgs = {
  Body?: any
  Params?: any
  Search?: any
}


export class API<T extends APIArgs = {}, fnResponse = unknown>  {
  /** 
   * - IF `b4()` return is truthy => returned value is sent to the client & route handler is not processed
   * - It is not recomended to do db calls in this function
   * - `b4()` purpose is to swiftly read event contents, append `event.locals`, `event.request` or `event.response`, do a redirect, or nothing and allow route or api fn to to process next
   */
  b4?: B4

  /** url path, if not specified will use file path */
  path: string

  /** The fn to be done on GET, POST, PUT or DELETE  */
  fn?: APIFn<fnResponse>

  /** Helpful for gen file */
  name?: string

  /** Turns url parameters (:param and :param?) into regex patterns to match path's */
  pattern: RegExp

  constructor(options: APIOptions<fnResponse>) {
    this.b4 = options.b4
    this.path = options.path
    this.fn = options.fn
    this.pattern = options.pattern || pathnameToPattern(options.path)
  }
}



export type APIOptions<fnResponse> = {
  /** 
   * - IF `b4()` return is truthy => returned value is sent to the client & route handler is not processed
   * - It is not recomended to do db calls in this function
   * - `b4()` purpose is to swiftly read event contents, append `event.locals`, `event.request` or `event.response`, do a redirect, or nothing and allow route or api fn to to process next
   */
  b4?: B4,

  /** url path, if not specified will use file path */
  path: string

  /** Turns url parameters (:param and :param?) into regex patterns to match path's */
  pattern?: RegExp

  /** The fn to be done on GET, POST, PUT or DELETE  */
  fn?: APIFn<fnResponse>
}


export type APIFn<fnResponse> = (args: APIFnArgs) => Promise<fnResponse>


export type APIFnArgs = { be: BE, event: APIEvent }
