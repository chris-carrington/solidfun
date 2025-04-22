/**
 * 🧚‍♀️ How to access:
 *     - import { go } from '@solidfun/go'
 */


import { buildURL } from '../buildURL'
import { redirect } from '@solidjs/router'
import type { Routes, Route_Params, GoResponse } from './types'



/**
 * - Wraps "@solidjs/router" `redirect()`
 * - Provides intellisense to current routes
 */
export const go = <T extends Routes>(path: T, params?: Route_Params<T>): GoResponse => redirect(buildURL(path, params))
