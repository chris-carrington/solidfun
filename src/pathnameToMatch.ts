import { API } from './fundamentals/api'
import { Route } from './fundamentals/route'



/**
 * - From pathname → Route or API + extracted params
 * - Returns `undefined` if no pattern matches (→ your 404)
 */
export function pathnameToMatch(pathname: string, map: Record<string, API | Route>): RouteMatch<API | Route> | undefined {
  for (const path of Object.keys(map) as Array<keyof typeof map>) {
    const match = map[path]?.pattern.exec(pathname)

    if (!match) continue

    const params: Record<string, string | undefined> = match.groups ?? {}
    const handler = map[path]! // assert okay b/c already did map[path]?.pattern above

    return { handler, params }
  }

  return undefined // no match
}



export type RouteMatch<R> = {
  handler: R
  params: Record<string, string | undefined>
}
