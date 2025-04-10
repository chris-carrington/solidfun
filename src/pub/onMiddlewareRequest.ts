
/**
 * 🧚‍♀️ How to access:
 *     - import { onMiddlewareRequest } from '@solidfun/onMiddlewareRequest'
 */


import { API } from './api'
import { routes } from './app'
import { Route } from './route'
import { gets, posts } from './apis'
import { getSessionData } from './session'
import type { FetchEvent } from './types'
import { eventToPathname } from '../eventToPathname'
import { pathnameToRoute } from '../pathnameToRoute'


/**
 * - Typically called by `getMiddleware()`
 * - Adds session data to `event.locals.sessionData`
 * - Matches a `FetchEvent` w/ the proper route or api
 * - If match has a `b4()`, calls it & returns its response
 * - If you would love to call this function, please see `getMiddleware()` for guidance, but it'd looks something like this:
  ```tsx
  export function getMiddleware() {
    return createMiddleware({
      async onRequest (e) {
        const res = await onMiddlewareRequest(e)
        // custom logic here
        if (res) return res
      }
    })
  }
  ```
 */
export async function onMiddlewareRequest(event: FetchEvent) {
  try {
    event.locals.sessionData = await getSessionData()

    const pathname = eventToPathname(event)
 
     switch(event.request.method) {
       case 'POST': return await onIsRequestingAnAPI(event, pathname, posts)
       case 'GET':
         const route = pathnameToRoute(pathname, routes)
 
         if (route instanceof Route) return await onRouteOrAPIMatched(event, route)
         else return await onIsRequestingAnAPI(event, pathname, gets)
     }
   } catch (e) {
     return e
   }
 }
 
 
 async function onRouteOrAPIMatched(event: FetchEvent, item: API | Route) {
  if (item.b4) return await item.b4(event)
 }
 
 
 async function onIsRequestingAnAPI(event: FetchEvent, pathname: string, apis: Record<string, API | Route>) {
   const api = pathnameToRoute(pathname, apis)
   if (api instanceof API) return await onRouteOrAPIMatched(event, api)
 }
 