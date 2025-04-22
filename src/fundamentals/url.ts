/**
 * 🧚‍♀️ How to access:
 *     - import { createRouteUrl, createApiGetUrl, creatApiPostUrl } from '@solidfun/url'
 */


import { buildURL } from '../buildURL'
import type { Routes, Route_Params, GET_Paths, InferGETParams, POST_Paths, InferPOSTParams } from './types'


/**
 * Create a url to a current route w/ intellisense
 * @param path As it appears at `new Route()`
 * @param params Object w/ keys from `path` & custom values, that when defined, get be placed into the `path`
 * @returns URL route string, w/o the env build url addded to the beginning
 */
export const createRouteUrl = <T extends Routes>(path: T, params?: Route_Params<T>): string => buildURL(path, params)


/**
 * Create a url to a current api GET w/ intellisense
 * @param path As it appears at `new API()`
 * @param params Object w/ keys from `path` & custom values, that when defined, get be placed into the `path`
 * @returns URL api GET string, w/o the env build url addded to the beginning
 */
export const createApiGetUrl = <T extends GET_Paths>(path: T, params?: InferGETParams<T>): string => buildURL(path, params)


/**
 * Create a url to a current api POST w/ intellisense
 * @param path To the route
 * @param params Object w/ keys from `path` & custom values, that when defined, get be placed into the `path`
 * @returns URL api POST string, w/o the env build url addded to the beginning
 */
export const creatApiPostUrl = <T extends POST_Paths>(path: T, params?: InferPOSTParams<T>): string => buildURL(path, params)
