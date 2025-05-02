/**
 * 🧚‍♀️ How to access:
 *     - import { API } from '@solidfun/api'
 *     - import type { APIOptions } from '@solidfun/api'
 */


import type { BE } from './be'
import { pathnameToPattern } from './pathnameToPattern'
import type { APIBody, URLSearchParams, URLParams, B4 } from './types'



/** - Create a GET or POST, API endpoint */
export class API<
  T_Params extends APIBody = {},
  T_Search extends URLSearchParams = {},
  T_Body extends URLParams = {},
  T_Fn_Response extends Function | unknown = unknown
> {
  public readonly values: {
    path: string
    pattern: RegExp
    b4?: B4
    fn?: APIFn<T_Params, T_Search, T_Body, T_Fn_Response>
  }

  constructor(path: string) {
    this.values = {
      path,
      pattern: pathnameToPattern(path),
    }
  }


  /** 
   * ### Set async function to run before api boot
   * - IF `b4()` return is truthy => returned value is sent to the client & api fn is not processed
   * - It is not recomended to do db calls in this function
   * - `b4()` purpose is to:
   *     - Read `event` contents (headers, cookies)
   *     - Append `event.locals`, `event.request` or `event.response`
   *     - Do a redirect
   *     - Return nothing and allow api fn to to process next
   * - 🚨 If returning the response must be a `Response` object b/c this is what is given to the client
   * - 🚨 When calling `go()` from w/in a `b4` a return type is required, b/c ts needs to know about all api's when we call `go()` to provide autocomplete but we are defining an api while calling `go()`. So the return type stops the loop of defining & searching
   * @example
    ```ts
    import { API } from '@solidfun/api'
    import { authB4 } from '@src/lib/b4'
    import { M_Contract } from '@src/db/M_Contract'

    export const GET = new API('/api/contract/:contractId')
      .b4(authB4)
      .params<{contractId: string}>()
      .fn(async (be) => {
        return be.json({ params: be.getParams() })
      })
    ```
   */
  b4(fn: B4): this {
    this.values.b4 = fn
    return this
  }


  /** 
   * ### Set async function to run when api is called
   * @example
    ```ts
    import { API } from '@solidfun/api'
    import { authB4 } from '@src/lib/b4'
    import { M_Contract } from '@src/db/M_Contract'

    export const GET = new API('/api/contract/:contractId')
      .b4(authB4)
      .params<{contractId: string}>()
      .fn(async (be) => {
        return be.json({ params: be.getParams() })
      })
    ```
   */
  fn<T_New_Fn_Response>(fn: APIFn<T_Params, T_Search, T_Body, T_New_Fn_Response>): API<T_Params, T_Search, T_Body, T_New_Fn_Response> {
    (this.values as any).fn = fn
    return this as unknown as API<T_Params, T_Search, T_Body, T_New_Fn_Response>
  }


  /**
   * ### Set the type for the url params
   * - If `.params()` is below `.fn() `then `.fn()` won't have typesafety
   * @example
    ```ts
    export const GET = new API('/api/fortune/:id')]
      .params<{ id: number }>()
      .fn(async (be) => {
        const params = be.getParams()
        return be.json({ params })
      })
    ```
   */
  params<T_New_Params extends URLParams>(): API<T_New_Params, T_Search, T_Body, T_Fn_Response> {
    return this as unknown as API<T_New_Params, T_Search, T_Body, T_Fn_Response>
  }


  /**
   * ### Set the type for the request body
   * - If `.body()` is below `.fn() `then `.fn()` won't have typesafety
   * @example
    ```ts
    import { API } from '@solidfun/api'
    import { authB4 } from '@src/lib/b4'
    import { parseSessionData } from '@src/lib/parseSessionData'
    import { createIndividualSchema, CreateIndividualSchema } from '@src/schemas/CreateIndividualSchema'


    export const POST = new API('/api/create-individual')
      .b4(authB4)
      .body<CreateIndividualSchema>()
      .fn(async (be) => {
        const body = createIndividualSchema.parse(await be.getBody())

        const {userId} = await parseSessionData()

        return be.json({ userId, body })
      })
    ```
   */
  body<T_New_Body extends APIBody>(): API<T_Params, T_Search, T_New_Body, T_Fn_Response> {
    return this as unknown as API<T_Params, T_Search, T_New_Body, T_Fn_Response>
  }
}


export type APIFn<
  T_Params extends Record<any, any>,
  T_Search extends Record<string, string | string[]>,
  T_Body extends Record<any, any>,
  T_Fn_Response
> = (be: BE<T_Params, T_Search, T_Body>) => Promise<T_Fn_Response>
