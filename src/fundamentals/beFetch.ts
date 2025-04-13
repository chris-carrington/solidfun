/**
 * 🧚‍♀️ How to access:
 *     - import { beFetch, beGET , bePOST, beParse, _beAPI } from '@solidfun/beFetch'
 */


import { getCookie } from 'vinxi/http'
import { buildURL } from '../buildURL'
import { url as baseUrl } from './env'
import { config } from '../../fun.config'
import { redirect } from '@solidjs/router'
import { query, createAsync } from '@solidjs/router'
import type { GET_Paths, GET_Params, POST_Paths, POST_Body, POST_Params, GET_fn_Response } from './types'



/**
 * - Solid JS `query()`
 * - Typically called in a `.tsx` file when we want to do async stuff during render
 * - If render is ready and async is not, render is sent to client and streamed to client when ready
 * @param fn - Anonymous function that calls w/in does a fetch
 * @param cacheKey - Helps browser cache this data for back button, or multi calls on page, but a page refresh is always fresh data
 */
export const beFetch = query



/**
 * - Call BE api GET endpoint from BE w/ intellisense
 * - Typically called w/in a `beFetch()` during component render
 * - on error => `console.error()` the error and return null or error based on `options.returnError`, defaults to return null
 */
export async function beGET<T extends GET_Paths>(path: T, options?: { params?: GET_Params<T>, returnError: boolean }): Promise<GET_fn_Response<T>> {
  return await _beAPI({ url: buildURL(path, options?.params), method: 'GET', cookieKey: config.cookieKey, returnError: options?.returnError })
}



/**
 * - Call BE api POST endpoint from BE w/ intellisense
 * - Typically called w/in a `beFetch()` during component render
 * - on error => `console.error()` the error and return null or error based on `options.returnError`, defaults to return null
 */
export async function bePOST<T extends POST_Paths>(path: T, options?: { params?: POST_Params<T>, body?: POST_Body<T>, returnError: boolean }) {
  return await _beAPI({ url: buildURL(path, options?.params), method: 'POST', cookieKey: config.cookieKey, body: options?.body, returnError: options?.returnError })
}



/** 
 * - Typically called by a `beGET()` or `bePOST()`
 * - Sends current cookie w/ request
 * - If response is a redirect => `_beAPI()` will do the solidjs redirect()
 * - Else If there was an error w/ the request => `_beAPI()` will `console.error()` the error and return null or error based on `options.returnError`, defaults to return null
 * - Else => Respond w/ parsed data
 */
export async function _beAPI({ url, cookieKey, method = 'GET', body, returnError }: { url: string, cookieKey?: string, method: 'GET' | 'POST', body?: any, returnError?: boolean }) {
  'use server'

  try {
    if (!cookieKey) throw new Error('Please set fun.config "cookieKey" so that _beAPI will work')

    let requestInit = {}
    const cookieValue = getCookie(cookieKey)
    const Cookie = cookieKey + "=" + cookieValue
    
    switch (method) {
      case 'GET':
        requestInit = {
          headers: { Cookie }
        }
        break
      case 'POST':
        requestInit = {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { Cookie },
        }        
        break
    }

    const response = await fetch(baseUrl + url, requestInit)

    if (response.redirected) return redirect(response.url)
    else return await response.json()
  } catch (error) {
    console.error('❌ beDoFetch error', error)
    return returnError ? error : null
  }
}



/**
 * - Solid JS `createAsync()`
 * - Typically called in a `component()` to parse data that came from `beFetch()`
 * - A great place to put the response of this is in a `<Suspense>` b/c the content will be created during render so when the data is ready it's added to slots and shown quickly
 */
export const beParse = createAsync
