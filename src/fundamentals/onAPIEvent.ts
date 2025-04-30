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


export async function onAPIEvent(event: APIEvent, apis: Record<string, API>) {
  try {
    const routeMatch = pathnameToMatch(eventToPathname(event), apis)

    if (routeMatch?.handler instanceof API && typeof routeMatch.handler.fn === 'function') {
      return await routeMatch.handler.fn(new BE(event, routeMatch.params))
    }
  } catch (error) {
    return json(FunError.catch({ error }), { status: 400 })
  }
}
