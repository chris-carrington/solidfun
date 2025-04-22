/**
 * 🧚‍♀️ How to access:
 *     - import { beAsync, beGET , bePOST, beParse, _beAPI } from '@solidfun/beAsync'
 */


import { go } from './go'
import { BE_Error } from '../beError'
import { getCookie } from 'vinxi/http'
import { buildURL } from '../buildURL'
import { url as baseUrl } from './env'
import { config } from '../../fun.config'
import { query, createAsync } from '@solidjs/router'
import type { GET_Paths, InferGETParams, POST_Paths, InferPOSTBody, InferPOSTParams, InferGETResponse, Routes, GoResponse } from './types'



/**
 * - Solid JS `query()`
 * - Typically called in a `.tsx` file when we want to do async stuff during render
 * - If render is ready and async is not, render is sent to client and streamed to client when ready
 * @param fn - Anonymous function that calls w/in does a fetch
 * @param cacheKey - Helps browser cache this data for back button, or multi calls on page, but a page refresh is always fresh data
 */
export const beAsync = query



/**
 * - Call BE api GET endpoint from BE w/ intellisense
 * - Typically called w/in a `beAsync()` during component render
 * - on error => `console.error()` the error and return null or error based on `options.returnError`, defaults to return null
 */
export async function beGET<T extends GET_Paths>(path: T, options?: { params?: InferGETParams<T> }): Promise<GoResponse | InferGETResponse<T>> {
  'use server'
  return await _beAPI<InferGETResponse<T>>({ url: buildURL(path, options?.params), method: 'GET', cookieKey: config.cookieKey })
}



/**
 * - Call BE api POST endpoint from BE w/ intellisense
 * - Typically called w/in a `beAsync()` during component render
 * - on error => `console.error()` the error and return null or error based on `options.returnError`, defaults to return null
 */
export async function bePOST<T extends POST_Paths>(path: T, options?: { params?: InferPOSTParams<T>, body?: InferPOSTBody<T> }) {
  'use server'
  return await _beAPI({ url: buildURL(path, options?.params), method: 'POST', cookieKey: config.cookieKey, body: options?.body })
}



/** 
 * - 🚨 If the response headers Content-Type is not `application/json` we will do `await response.text()` and give you that response in an a thrown error and not do `await response.json()`
 * - Typically called by a `beGET()` or `bePOST()` which automatically adds the `application/json` header
 * - Sends current cookie w/ request
 * - If response is a redirect => `_beAPI()` will do the solidjs redirect()
 * - If there was an error => parse / throw it
 * - If all good => Respond w/ parsed data
 */
export async function _beAPI<T_Response>({ url, cookieKey, method = 'GET', body }: { url: string, cookieKey?: string, method: 'GET' | 'POST', body?: any }): Promise<GoResponse | T_Response> {
  'use server'

  try {
    if (!cookieKey) throw new Error('Please set the "cookieKey" @ "fun.config" for "_beAPI()"')

    const cookieValue = getCookie(cookieKey)
    const Cookie = cookieKey + "=" + cookieValue
    const requestInit: RequestInit = { method, headers: { Cookie } }

    if (method === 'POST') requestInit.body = body

    const response = await fetch(baseUrl + url, requestInit)

    if (response.redirected) return go(response.url as Routes)

    const contentType = response.headers.get('Content-Type') || ''

    if (!contentType.includes('application/json')) throw new BE_Error({ message: '❌ BE Async Error', rawBody: await response.text(), status: response.status, statusText: response.statusText })
    else {
      const res: T_Response = await response.json()
      return res
    }
  } catch (error) {
    throw BE_Error.catch({ error })
  }
}



/**
 * - Solid JS `createAsync()`
 * - Typically called in a `component()` to parse data that came from `beAsync()`
 * - A great place to put the response of this is in a `<Suspense>` b/c the content will be created during render so when the data is ready it's added to slots and shown quickly
 */
export const beParse = createAsync
