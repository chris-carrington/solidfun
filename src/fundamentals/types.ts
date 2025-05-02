/**
 * 🧚‍♀️ How to access:
 *     - import type { APIResponse, InferPOSTBody, B4 ... } from '@solidfun/types'
 */


import type { FE } from './fe'
import type { API } from './api'
import type { JSX } from 'solid-js'
import type { routes } from './app'
import type { Route } from './route'
import type { gets, posts } from './apis'
import type { AccessorWithLatest, Params, redirect } from '@solidjs/router'
import type { APIEvent as SolidAPIEvent, FetchEvent as SolidFetchEvent } from '@solidjs/start/server'


export type GET_Paths = keyof typeof gets

export type POST_Paths = keyof typeof posts

export type Routes = keyof typeof routes


/** 
 * - How a response from a `new API()` is
 * - A redirect or a json
 * - & the json can handle data, errors, and/or `Valibot` / `Zod` messages
 */
export type APIResponse<T_Data = any> = GoResponse | JSONResponse<T_Data>


/** Backend redirect */
export type GoResponse = ReturnType<typeof redirect>


/**
 * - If an API does not respond / a redirect it responds w/ this JSON
 * - `Valibot` / `Zod` errors @ `res.error.messages`
 */
export type JSONResponse<T_Data = any> = {
  data: null | T_Data,
  error: null | FunErrorType
}


/**
 * - Supports `Valibot` / `Zod` messages
 * - Supports errors where we don't wanna parse the json
 * - Helpful when we wanna throw an error from one place get it in another, who knows how it was parsed, but stay simple w/ json and get the error info we'd love to know
 */
export type FunErrorType = {
  isFunError: true
  message?: string
  status?: number
  rawBody?: string
  statusText?: string
  messages?: FlatMessages
}


/**
 * - The component to render for a route
 */
export type RouteComponent<T_Params extends URLParams, T_Search extends URLSearchParams> = (fe: FE<T_Params, T_Search>) => JSX.Element


/**
 * - The component to render for a layout
 */
export type LayoutComponent = (fe: FE) => JSX.Element


/** 
 * - This is how `Valibot` / `Zod` flatten their errors
 */
export type FlatMessages = Record<string, string[]>


export type APIBody = Record<any, any>
export type URLSearchParams = Record<string, string | string[]>
export type URLParams = Record<string, any>


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
export type InferGETParams<T_Path extends keyof typeof gets> = typeof gets extends Record<any, any> // IF app has any GET endpoints
  ? T_Path extends keyof typeof gets // IF path is a valid path to an api GET
    ? API2Params<typeof gets[T_Path]> // infer / return params if set or undefined if unset
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


/** 
 * - Receives: API GET path
 * - Gives: The type for that api's response, aka the response to the `fn()` on that API
*/
export type InferPOSTResponse<T_Path extends POST_Paths> = typeof posts extends Record<any, any>
  ? T_Path extends keyof typeof posts
    ? API2FnResponse<typeof posts[T_Path]> // infer / return fn response type if set or undefined if unset
    : never
  : never


type Route2Params<T_Route extends Route> = T_Route extends Route<infer T_Params, any>
  ? T_Params extends Params
    ? T_Params
    : undefined
  : undefined


type API2Body<T_API extends API> = T_API extends API<any, any, infer T_Body, any>
  ? T_Body extends Record<any, any>
    ? T_Body
    : undefined
  : undefined



type API2Params<T_Params extends API<any>> = T_Params extends API<infer T_Params, any, any, any>
    ? [keyof T_Params] extends [never] // If T_Params is `{}`, we return undefined; else T_Params
      ? undefined
      : T_Params
    : undefined


type API2FnResponse<T_API extends API<any, any, any, any>> = T_API extends API<any, any, any, infer T_Fn_Response>
    ? T_Fn_Response
    : never
