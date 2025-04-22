
/**
 * 🧚‍♀️ How to access:
 *     - import { onMiddlewareRequest } from '@solidfun/onMiddlewareRequest'
 */


import { API } from './api'
import { routes } from './app'
import { Route } from './route'
import { gets, posts } from './apis'
import type { FetchEvent } from './types'
import { getSessionData } from './session'
import { eventToPathname } from '../eventToPathname'
import { pathnameToMatch, type RouteMatch } from '../pathnameToMatch'


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
         const routeMatch = pathnameToMatch(pathname, routes)
 
         if (routeMatch?.handler instanceof Route) return await onRouteOrAPIMatched(event, routeMatch)
         else return await onIsRequestingAnAPI(event, pathname, gets)
     }
   } catch (e) {
     return e
   }
 }
 
 
 async function onRouteOrAPIMatched<T extends API | Route>(event: FetchEvent, routeMatch: RouteMatch<T>) {
  if (routeMatch.handler.b4) return await routeMatch.handler.b4(event)
 }
 
 
 async function onIsRequestingAnAPI(event: FetchEvent, pathname: string, apis: Record<string, API | Route>) {
   const routeMatch = pathnameToMatch(pathname, apis)

   if (routeMatch?.handler instanceof API) {
    return await onRouteOrAPIMatched(event, routeMatch)
   }
 }
 