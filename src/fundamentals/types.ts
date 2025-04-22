/**
 * 🧚‍♀️ How to access:
 *     - import type { Routes, GET_Paths, POST_Paths, APIEvent, FetchEvent, B4, ... } from '@solidfun/types'
 */


import type { FE } from './fe'
import type { API } from './api'
import type { routes } from './app'
import type { Route } from './route'
import type { gets, posts } from './apis'
import type { AccessorWithLatest, redirect, RouteSectionProps } from '@solidjs/router'
import type { APIEvent as SolidAPIEvent, FetchEvent as SolidFetchEvent } from '@solidjs/start/server'


/**
 * - Our recommended JSON server response type b/c it handles:
 *     - Valibot / Zod errors @ `res.error.messages`
 *     - Errors that happen on `fetch()` that are not parsable (set `status`, `rawBody` and `statusText` from `fetch()` to `JSON_Response`)
 *     - Any other data / error response that is valid JSON
 * - Works great w/ the `Messages` component
 */
export type JSON_Response<T_Data = any> = {
  data?: T_Data,
  error?: {
    status?: number,
    message?: string,
    rawBody?: string,
    statusText?: string,
    messages?: JSONResponseMessages
  }
}


/** Backend redirect */
export type GoResponse = ReturnType<typeof redirect>


/** 
 * - Our recommnded server response
 * - A redirect or json
 * - & the json can handle data, errors, and/or valibot/zod messages
 */
export type BE_Response<T_Data = any> = JSON_Response<T_Data> | GoResponse


/** 
 * - If messages are in the response, this is the flattened type
 * - This is how Valibot / Zod flatten their errors
 * - Use the ServerError class to create an error
 */
export type JSONResponseMessages = Record<string, string[]>


/** 
 * - Source: `import type { APIEvent } from '@solidjs/start/server'`
 * - Called @ `GET` / `POST` api endpoints
 */
export type APIEvent = SolidAPIEvent


/** 
 * - Source: `import type { FetchEvent } from '@solidjs/start/server'`
 * - Called @ 
 */
export type FetchEvent = SolidFetchEvent


/**
 * - Source: `import type { RouteSectionProps } from '@solidjs/router'`
 * - With `fe` for ergonomics
 */
export type LayoutProps = RouteSectionProps & { fe: FE }



/**
 * - Source: `import type { RouteSectionProps } from '@solidjs/router'`
 * - Without children b/c w/ Solid Fun a Route component is a children foundation
 * - With `fe` for ergonomics
 */
export type RouteProps = Omit<RouteSectionProps, 'children'> & { fe: FE }



/** 
 * - Anonymous async function (aaf) that runs b4 api and/or route fn
 * - If the aaf's response is truthy, that response is given to client & the  api and/or route fn is not called, else the fn is called
 */
export type B4 = (event: FetchEvent) => Promise<any>


/**
 * - `path` to an api `GET` => type for `beParse()` response
 * - Helpful when you've done `const lorem = beParse(() => _lorem())` and want the type for lorem
 */
export type InferGETParse<T_GET_Path extends GET_Paths> = AccessorWithLatest<undefined | InferGETResponse<T_GET_Path>>


/** 
 * - Receives: Route path
 * - Gives: The type for that route's params
*/
export type InferRouteParams<T_Path extends keyof typeof routes> = typeof routes extends Record<any, any> // IF app has any routes
  ? T_Path extends keyof typeof routes // IF path is a valid path to a route
    ? Route2Params <typeof routes[T_Path]> // infer / return params if set or undefined if unset
    : undefined
  : undefined


/** 
 * - Receives: API GET path
 * - Gives: The type for that api's params
*/
export type InferGETParams<T_Path extends GET_Paths> = typeof gets extends Record<any, any> // IF app has any GET endpoints
  ? T_Path extends keyof typeof gets // IF path is a valid path to an api GET
    ? API2Params <typeof gets[T_Path]> // infer / return params if set or undefined if unset
    : undefined
  : undefined


/** 
 * - Receives: API POST path
 * - Gives: The type for that api's params
*/
export type InferPOSTParams<T_Path extends POST_Paths> = typeof posts extends Record<any, any>
  ? T_Path extends keyof typeof posts
    ? API2Params <typeof posts[T_Path]> // infer / return params type if set or undefined if unset
    : undefined
  : undefined


/** 
 * - Receives: API POST path
 * - Gives: The type for that api's body
*/
export type InferPOSTBody<T_Path extends POST_Paths> = typeof posts extends Record<any, any>
  ? T_Path extends keyof typeof posts
    ? API2Body<typeof posts[T_Path]> // infer / return body type if set or undefined if unset
    : undefined
  : undefined


/** 
 * - Receives: API GET path
 * - Gives: The type for that api's response, aka the response to the `fn()` on that API
*/
export type InferGETResponse<T_Path extends GET_Paths> = typeof gets extends Record<any, any>
  ? T_Path extends keyof typeof gets
    ? API2FnResponse<typeof gets[T_Path]> // infer / return fn response type if set or undefined if unset
    : never
  : never


type Route2Params<T_Route extends Route<any>> = T_Route extends Route<infer T_Args>
  ? T_Args extends { Params: infer T_Params }
    ? T_Params
    : undefined
  : undefined

type API2Body<T_API extends API<any, any>> = T_API extends API<infer T_Args, any>
  ? T_Args extends { Body: infer T_Body }
    ? T_Body
    : undefined
  : undefined


type API2Params<T_API extends API<any, any>> = T_API extends API<infer T_Args, any>
  ? T_Args extends { Params: infer T_Params }
    ? T_Params
    : undefined
  : undefined


type API2FnResponse<T_API extends API<any, any>> = T_API extends API<any, infer T_Fn_Response>
  ? T_Fn_Response
  : never


/** gen */
export type Routes = '/a' | '/b'
export type GET_Paths = '/api/get/a' | '/api/get/b'
export type POST_Paths = '/api/post/a' | '/api/post/b'

type a = InferGETResponse<'/api/get/a'>
type b = JSON_Response<a>
type c = Promise<b>

/**
 * - One purpose of this type is to stop the typescript cricular reference error when placing a `go()` w/in a `b4()`
 * - Explanation:
 *     - To provide intellisense, ``go()`` needs all routes info
 *     - So if we place a `go()` in a `b4()`, we ask for the information about all routes, while creating a route
 *     - This is difficult for typescript to handle
 *     - This return type allows us to have intellisense @ `go()` AND tell typescript to stop looking for all route info
 *     - Example:
       ```tsx
          import { go } from '@solidfun/go'
          import { Route } from '@solidfun/route'
          import type { GoResponse } from '@solidfun/types'

          export default new Route({
            path: '/',
            async b4(): GoResponse {
              return go('/example')
            }
          })
      ```
 */
