/**
 * 🧚‍♀️ How to access:
 *     - import type { Routes, GET_Paths, POST_Paths, APIEvent, FetchEvent, B4, ... } from '@solidfun/types'
 */


import type { API } from './api'
import type { routes } from './app'
import type { Route } from './route'
import type { gets, posts } from './apis'
import type { redirect } from '@solidjs/router'
import type { APIEvent as SolidAPIEvent, FetchEvent as SolidFetchEvent } from '@solidjs/start/server'


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
 * - Anonymous async function (aaf) that runs b4 api and/or route fn
 * - If the aaf's response is truthy, that response is given to client & the  api and/or route fn is not called, else the fn is called
 */
export type B4 = (event: FetchEvent) => Promise<any>


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
export type GoResponse = Promise<Awaited<ReturnType<typeof redirect>>> 


/**
 * - An api endpoint can respond w/ anything
 * - If you'd love to roll w/ some features & components that come w/ Solid Fun return a BE_Response
 * - Easiest way to do that is w/ be.json(), be.res(), or throw new Error()
 */
export type BE_Response<Data = undefined, Messages = undefined> = {
  data?: Data,
  messages?: Messages,
}

/** API is responding w/ data & messages */
export type DataMessagesResponse<T> = BE_Response<T, BE_Messages_Response>

/** API is responding w/ json */
export type JSONResponse<T> = BE_Response<T>

/** API is responding w/ messages */
export type MessagesResponse = BE_Response<null, BE_Messages_Response>

/** API does not have messages or data in the response */
export type VoidResponse = BE_Response

/** If messages are in the response, this is the type */
export type BE_Messages_Response = Record<string, string[]>


/** path to a route => type for route params */
export type Route_Params<T_Route_Paths extends keyof typeof routes> = 
  T_Route_Paths extends keyof typeof routes
    ? typeof routes[T_Route_Paths] extends Route<infer T_Route_Args> // IF route is a Route object THEN Infer the type of its args (search / params) and set this type to T_Route_Args
      ? T_Route_Args extends { Params?: infer T_Params } // IF T_Route_Args has the optional "Params" prop defined, set this type to T_Params
        ? T_Params // return the type for the route params
        : undefined
      : undefined
    : undefined;


/** path to an api GET => type for GET params */
export type GET_Params<T_GET_Path extends GET_Paths> =
  typeof gets extends Record<any, any> // IF app has any GET endpoints
    ? T_GET_Path extends keyof typeof gets // IF path is a valid path to an api GET
      ? typeof gets[T_GET_Path] extends API<infer T_API_Args, any> // IF this api is an API object THEN Infer the type of its args (search / params) and set this type to T_API_Args
        ? T_API_Args extends { Params?: infer T_Params } // IF T_API_Args has the optional "Params" prop defined, set this type to T_Params
          ? T_Params // return the type for the api request params
          : undefined
        : undefined
      : undefined
    : undefined;


/** path to an api POST => type for POST params */
export type POST_Params<T_POST_Path extends POST_Paths> =
  typeof posts extends Record<any, any> // IF app has any POST endpoints
    ? T_POST_Path extends keyof typeof posts // IF path is a valid path to an api POST
      ? typeof posts[T_POST_Path] extends API<infer T_API_Args, any> // IF this api is an API object THEN Infer the type of its args (search / params) and set this type to T_API_Args
        ? T_API_Args extends { Params?: infer T_Params } // IF T_API_Args has the optional "Params" prop defined, set this type to T_Params
          ? T_Params // return the type for the api request params
          : undefined
        : undefined
      : undefined
    : undefined;


/** path to an api POST => type for POST body */
export type POST_Body<T_POST_Paths extends POST_Paths> =
  typeof posts extends Record<any, any> // IF app has any POST endpoints
    ? T_POST_Paths extends keyof typeof posts // IF path is a valid path to an api POST
      ? typeof posts[T_POST_Paths] extends API<infer T_API_Args, any> // IF this api is an API object THEN Infer the type of its args (body search / params) and set this type to T_API_Args
        ? T_API_Args extends { Body?: infer T_Body } // IF T_API_Args has the optional "Body" prop defined, set this type to T_Body
          ? T_Body // return the type for the api request body
          : undefined
        : undefined
      : undefined
    : undefined;


/** path to an api GET => type for GET fn response */
export type GET_fn_Response<T_GET_Path extends GET_Paths> =
  typeof gets extends Record<any, any>
    ? T_GET_Path extends keyof typeof gets
      ? typeof gets[T_GET_Path] extends API<any, infer T_Fn_Response>
        ? T_Fn_Response
        : never
      : never
    : never;


/**
 * Enforce the exact shape of keys from InferOutput<T>.
 * Allow more flexible values (e.g., string | null instead of just string).
 * Disallow extra keys not in the inferred shape.
 */
type AllowAnyValue<T> = { [K in keyof T]: unknown }
type ExactKeys<T, U> = Exclude<keyof U, keyof T> extends never
  ? Exclude<keyof T, keyof U> extends never
    ? U
    : never
  : never;

export type AnyValue<T> = ExactKeys<T, AllowAnyValue<T>>


/** gen */
export type Routes = '/a' | '/b'
export type GET_Paths = '/api/get/a' | '/api/get/b'
export type POST_Paths = '/api/post/a' | '/api/post/b'
