/**
 * 🧚‍♀️ How to access:
 *     - import { Route } from '@solidfun/route'
 *     - import type { RouteArgs, RouteOptions, RouteFilters } from '@solidfun/route'
 */


import type { B4 } from './types'
import type { JSX } from 'solid-js'
import type { Layout } from './layout'
import type { RouteComponentArgs } from './app'
import { pathnameToPattern } from './pathnameToPattern'


export type RouteArgs = {
  Params?: any
  Search?: any
}


/**
 * - Create a route for your application
 * - Behind the scenes will use this information to create SolidJS Route components: https://docs.solidjs.com/solid-router/concepts/nesting
 */
export class Route<T extends RouteArgs = {}> {
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

  /** Group funcitionality, context & styling */
  layout?: Layout

  /** url path */
  path: string

  /** Turns url parameters (:param and :param?) into regex patterns to match path's */
  pattern: RegExp

  /** 
   * - If fetching data is necessary see: `beFetch()`
   * - If form submission is necessary see: `createOnSubmit()`
   */
  component?: (args: RouteComponentArgs) => JSX.Element

  /**
   * - https://docs.solidjs.com/solid-router/concepts/path-parameters
   * - If filter match is falsy => application renders `./src/routes/[...404].tsx`
   */
  filters?: RouteFilters

  constructor(options: RouteOptions) {
    this.b4 = options.b4
    this.path = options.path
    this.layout = options.layout
    this.filters = options.filters
    this.component = options.component
    this.pattern = options.pattern || pathnameToPattern(options.path)
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

  /** Group funcitionality, context & styling */
  layout?: Layout,

  /** url path */
  path: string

  /** Turns url parameters (:param and :param?) into regex patterns to match path's */
  pattern?: RegExp

  /** 
   * - If fetching data is necessary see: `beFetch()`
   * - If form submission is necessary see: `createOnSubmit()`
   */
  component?: (args: RouteComponentArgs) => JSX.Element

  /**
   * - https://docs.solidjs.com/solid-router/concepts/path-parameters
   * - If filter match is falsy => application renders `./src/routes/[...404].tsx`
   */
  filters?: RouteFilters
}


/**
 * - https://docs.solidjs.com/solid-router/concepts/path-parameters
 * - If filter match is falsy => application renders `./src/routes/[...404].tsx`
 */
export type RouteFilters = Record<string, any>
