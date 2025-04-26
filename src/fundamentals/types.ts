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
 *     - `Valibot` / `Zod` errors @ `res.error.messages`
 *     - Errors that happen on `fetch()` that are not parsable (set `status`, `rawBody` and `statusText` from `fetch()` to `FunErrorShape`)
 *     - Any other data / error response that is `JSON`
 * - Works great w/ the `Messages` component
 * - The template loves when we have a common response shape but this is optional
 * - But if you're catching a `Solid Fun` thrown error, it'll most likely be in this format
 */
export type JSON_Response<T_Data = any> = {
  data?: T_Data,
  error?: FunErrorType
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


/** Backend redirect */
export type GoResponse = ReturnType<typeof redirect>


/** 
 * - Our recommnded server response
 * - A redirect or json
 * - & the json can handle data, errors, and/or `Valibot` / `Zod` messages
 */
export type BE_Response<T_Data = any> = JSON_Response<T_Data> | GoResponse


/** 
 * - This is how `Valibot` / `Zod` flatten their errors
 */
export type FlatMessages = Record<string, string[]>


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
