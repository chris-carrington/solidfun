/**
 * 🧚‍♀️ How to access:
 *     - import { go } from '@solidfun/go'
 */


import { buildURL } from '../buildURL'
import { redirect } from '@solidjs/router'
import type { Routes, InferRouteParams, GoResponse } from './types'



/**
 * - Wraps "@solidjs/router" `redirect()`
 * - Provides intellisense to current routes
 * - Typically called w/in a `b4()` fn, same as `be.go()`
 */
export function go<T extends Routes>(path: T, params?: InferRouteParams<T>): GoResponse {
  return redirect(buildURL(path, params))
}
