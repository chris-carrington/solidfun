/**
 * 🧚‍♀️ How to access:
 *     - import { Route } from '@solidfun/route'
 *     - import type { RouteOptions } from '@solidfun/route'
 */


import type { Layout } from './layout'
import type { B4, Component } from './types'
import { pathnameToPattern } from './pathnameToPattern'



/**
 * - Create a route for your application
 * - Behind the scenes will use this information to create SolidJS Route components: https://docs.solidjs.com/solid-router/concepts/nesting
 */
export class Route<T_Args extends RouteArgs = {}> {
  /** 
   * - IF `this.b4()` return is truthy => returned value is sent to the client & `this.component()` is not called
   * - It is not recomended to do db calls in `this.b4()`
   * - Recomended options include:
   *     - Read request event 
   *     - Append values to request
   *     - Do a redirect
   *     - Append values to response
   *     - Append values `event.locals`
   * - From an auth perspective, `this.b4()` is a great spot to do a 1st session data check, so `getSessionData()` and append it to`event.locals`. & then  `this.component()` is a great spot to do a 2nd more thorough session data check w/ db calls. This process is similair to the 2 steps movie theater ticket verification process
   * - ✨ Note: If returning from `b4`, that response must be a `Response` object. So if a redirect is desired use [Response.redirect](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect_static) or the Solid's `redirect()` which does that for us or the Solid Fun's `go()` which calls `redirect()` and provides intellisense!
   * - 🚨 Important note: If calling `go()` in `b4()` add a return type of `GoResponse` to `b4()`. `go()` requires knowledge of all routes, so calling `go()` in a route will cause a ts recursion loop w/o the return type, example:
        ```ts
        import { go } from '@solidfun/go'
        import { Route } from '@solidfun/route'
        import type { GoResponse } from '@solidfun/types'


        export default new Route({
          path: '/',
          async b4(): GoResponse {
            return go('/test')
          }
        })
        ```
   */
  b4?: B4

  /** 
   * - Group funcitionality, context & styling
   * - The first layout provided will wrap all the remaining layouts & the current route
   */
  layouts?: Layout[]

  /** url path */
  path: string

  /** Turns url parameters (:param and :param?) into regex patterns to match path's */
  pattern: RegExp

  /** 
   * - If fetching data is necessary see: `beAsync()`
   * - If form submission is necessary see: `createOnSubmit()`
   */
  component?: Component

  /**
   * - https://docs.solidjs.com/solid-router/concepts/path-parameters
   * - If filter match is falsy => application renders `./src/routes/[...404].tsx`
   */
  filters?: RouteFilters

  constructor(options: RouteOptions) {
    this.b4 = options.b4
    this.path = options.path
    this.layouts = options.layouts
    this.filters = options.filters
    this.component = options.component
    this.pattern = options.pattern || pathnameToPattern(options.path)
  }


  /**
   * - Add to Route, updated type info:
   *     - `Omit<T_Args, 'Search'>`: Omit from `T_Args` the existing `Search` type 
   *     - `& { Search: T_Search }`: Add to `T_Args` a new `Search` type
   */
  search<T_Search>(): Route<Omit<T_Args, 'Search'> & { Search: T_Search }> {
    return this
  }


  /**
   * - Add to Route, updated type info:
   *     - `Omit<T_Args, 'Params'>`: Omit from `T_Args` the existing `Params` type 
   *     - `& { Params: T_Params }`: Add to `T_Args` a new `Params` type
   */
  params<T_Params>(): Route<Omit<T_Args, 'Params'> & { Params: T_Params }> {
    return this
  }
}


export type RouteOptions = {
  /** 
   * - IF `this.b4()` return is truthy => returned value is sent to the client & `this.component()` is not called
   * - It is not recomended to do db calls in `this.b4()`
   * - Recomended options include:
   *     - Read request event 
   *     - Append values to request
   *     - Do a redirect
   *     - Append values to response
   *     - Append values `event.locals`
   * - From an auth perspective, `this.b4()` is a great spot to do a 1st session data check, so `getSessionData()` and append it to`event.locals`. & then  `this.component()` is a great spot to do a 2nd more thorough session data check w/ db calls. This process is similair to the 2 steps movie theater ticket verification process
   * - 🚨 Important note: If returning from `b4`, that response must be a `Response` object. So if a redirect is desired use [Response.redirect](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect_static) or the Solid's `redirect()` which does that for us or the Solid Fun's `go()` which calls `redirect()` and provides intellisense!
   */
  b4?: B4,

  /** 
   * - Group funcitionality, context & styling
   * - The first layout provided will wrap all the remaining layouts & the current route
   */
  layouts?: Layout[]

  /** url path */
  path: string

  /** Turns url parameters (:param and :param?) into regex patterns to match path's */
  pattern?: RegExp

  /** 
   * - If fetching data is necessary see: `beAsync()`
   * - If form submission is necessary see: `createOnSubmit()`
   */
  component?: Component

  /**
   * - https://docs.solidjs.com/solid-router/concepts/path-parameters
   * - If filter match is falsy => application renders `./src/routes/[...404].tsx`
   */
  filters?: RouteFilters
}



type RouteArgs<Search = unknown, Params = unknown> = {
  Params?: Params
  Search?: Search
}


/**
 * - https://docs.solidjs.com/solid-router/concepts/path-parameters
 * - If filter match is falsy => application renders `./src/routes/[...404].tsx`
 */
type RouteFilters = Record<string, any>
