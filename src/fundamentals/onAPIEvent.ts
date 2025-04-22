/**
 * 🧚‍♀️ How to access:
 *     - import { onAPIEvent } from '@solidfun/onAPIEvent'
 */



import { BE } from './be'
import { API } from './api'
import { BE_Error } from '../beError'
import { json } from '@solidjs/router'
import type { APIEvent } from './types'
import { eventToPathname } from '../eventToPathname'
import { pathnameToMatch } from '../pathnameToMatch'


export async function onAPIEvent(event: APIEvent, apis: Record<string, API>) {
  const be = new BE()

  try {
    const routeMatch = pathnameToMatch(eventToPathname(event), apis)

    if (routeMatch?.handler instanceof API && typeof routeMatch.handler.fn === 'function') {
      return await routeMatch.handler.fn({ be, event, params: routeMatch.params })
    }
  } catch (error) {
    return json(BE_Error.catch({ error }), { status: 400 })
  }
}
