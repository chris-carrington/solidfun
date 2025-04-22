/**
 * 🧚‍♀️ How to access:
 *     - import { API } from '@solidfun/api'
 *     - import type { APIOptions } from '@solidfun/api'
 */



import { BE } from './be'
import type { B4, APIEvent } from './types'
import { pathnameToPattern } from './pathnameToPattern'



/** - Create a GET or POST, API endpoint */
export class API<T_Args extends APIArgs = {}, T_Fn_Response = unknown> {
  /** 
   * - IF `b4()` return is truthy => returned value is sent to the client & route handler is not processed
   * - It is not recomended to do db calls in this function
   * - `b4()` purpose is to swiftly read event contents, append `event.locals`, `event.request` or `event.response`, do a redirect, or nothing and allow route or api fn to to process next
   */
  b4?: B4

  /** url path, if not specified will use file path */
  path: string

  /** The fn to be done on GET, POST, PUT or DELETE  */
  fn?: APIFn<T_Fn_Response>

  /** Turns url parameters (:param and :param?) into regex patterns to match path's */
  pattern: RegExp

  constructor(options: APIOptions<T_Fn_Response>){
    this.b4 = options.b4
    this.path = options.path
    this.fn = options.fn
    this.pattern = options.pattern || pathnameToPattern(options.path)
  }


  /**
   * - Add to API, updated type info:
   *     - `Omit<T_Args, 'Body'>`:Omit from `T_Args` the existing `Body` type 
   *     - `& { Body: T_Body }`:  Add to `T_Args` a new `Body` type
   */
  body<T_Body>(): API<Omit<T_Args, 'Body'> & { Body: T_Body }, T_Fn_Response> {
    return this
  }


  /**
   * - Add to API, updated type info:
   *     - `Omit<T_Args, 'Search'>`: Omit from `T_Args` the existing `Search` type 
   *     - `& { Search: T_Search }`: Add to `T_Args` a new `Search` type
   */
  search<T_Search>(): API<Omit<T_Args, 'Search'> & { Search: T_Search }, T_Fn_Response> {
    return this
  }


  /**
   * - Add to API, updated type info:
   *     - `Omit<T_Args, 'Params'>`: Omit from `T_Args` the existing `Params` type 
   *     - `& { Params: T_Params }`: Add to `T_Args` a new `Params` type
   */
  params<T_Params>(): API<Omit<T_Args, 'Params'> & { Params: T_Params }, T_Fn_Response> {
    return this
  }
}



export type APIOptions<T_Fn_Response> = {
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
  fn?: APIFn<T_Fn_Response>
}


type APIFn<T_Fn_Response> = ({ be, event, params }: { be: BE, event:APIEvent, params: Record<string, string | undefined> }) => Promise<T_Fn_Response>


type APIArgs<Body = unknown, Search = unknown, Params = unknown> = {
  Body?: Body
  Search?: Search
  Params?: Params
}
