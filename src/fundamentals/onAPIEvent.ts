/**
 * 🧚‍♀️ How to access:
 *     - import { onAPIEvent } from '@solidfun/onAPIEvent'
 */



import { BE } from './be'
import { API } from './api'
import { FunError } from '../funError'
import { json } from '@solidjs/router'
import type { APIEvent } from './types'
import { eventToPathname } from '../eventToPathname'
import { pathnameToMatch } from '../pathnameToMatch'


export async function onAPIEvent(event: APIEvent, apis: Record<string, API<any>>) {
  try {
    const routeMatch = pathnameToMatch(eventToPathname(event), apis)

    if (routeMatch?.handler instanceof API && typeof routeMatch.handler.values.fn === 'function') {
      type HandlerAPI = typeof routeMatch.handler
      type Params = HandlerAPI extends API<infer T_Params, any, any, any> ? T_Params : {}
      type Search = HandlerAPI extends API<any, infer T_Search, any, any> ? T_Search : {}
      type Body = HandlerAPI extends API<any, any, infer T_Body, any> ? T_Body : {}

      const be = new BE<Params, Search, Body>(event, routeMatch.params)

      return await routeMatch.handler.values.fn(be)
    }
  } catch (error) {
    return json(FunError.catch({ error }), { status: 400 })
  }
}
