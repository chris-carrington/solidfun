/**
 * 🧚‍♀️ How to access:
 *     - import { onAPIEvent } from '@solidfun/onAPIEvent'
 */



import { BE } from './be'
import { API } from './api'
import type { APIEvent } from './types'
import { eventToPathname } from '../eventToPathname'
import { pathnameToRoute } from '../pathnameToRoute'


export async function onAPIEvent(event: APIEvent, apis: Record<string, API>) {
  const be = new BE()

  try {
    const api = pathnameToRoute(eventToPathname(event), apis)
    if (api instanceof API && typeof api.fn === 'function') return await api.fn({ be, event })
  } catch (e) {
    return be.catch(e)
  }
}
