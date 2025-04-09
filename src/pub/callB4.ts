
/**
 * 🧚‍♀️ How to access:
 *     - import { callB4 } from '@solidfun/callB4'
 */


import { API } from './api'
import { routes } from './app'
import { Route } from './route'
import { gets, posts } from '../apis'
import { getSessionData } from './session'
import type { FetchEvent } from './types'
import { eventToPathname } from '../eventToPathname'
import { pathnameToRoute } from '../pathnameToRoute'


/**
 * - Typically called by `getMiddleware()`
 * - Matches a `FetchEvent` w/ the proper route or api
 * - If match has a `b4` function `callB4()` calls it
 * - Returns: `b4()` response or an error if any happened
 * - If you would love to call this function, please see `getMiddleware()` for guidance on how to do that correctly
 */
export async function callB4(event: FetchEvent) {
  try {
     const pathname = eventToPathname(event)
 
     switch(event.request.method) {
       case 'POST':
        return await onAPI(event, pathname, posts)
       case 'GET':
         const route = pathnameToRoute(pathname, routes)
 
         if (route instanceof Route) return await doTheCall(event, route)
         else return await onAPI(event, pathname, gets)
     }
   } catch (e) {
     return e
   }
 }
 
 
 async function doTheCall(event: FetchEvent, item: API | Route) {
   if (item.b4) {
     event.locals.sessionData = await getSessionData()
     return await item.b4(event)
   }
 }
 
 
 async function onAPI(event: FetchEvent, pathname: string, apis: Record<string, API | Route>) {
   const api = pathnameToRoute(pathname, apis)
   if (api instanceof API) return await doTheCall(event, api)
 }
 