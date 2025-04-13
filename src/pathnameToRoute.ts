import { API } from './fundamentals/api'
import { Route } from './fundamentals/route'

/**
 * - From pathname
 * - To Route or API
 * - Useful if you know the current url and you wanna know what route or api handles it
 */
export function pathnameToRoute(pathname: string, map: Record<string, API | Route>) {
  const route = map[pathname as keyof typeof map]

  if (!route) {
    for (const path of Object.keys(map) as Array<keyof typeof map>) {
      if (pathname.match((map[path] as any).pattern)) {
        return map[path]
      }
    }
  }

  return route
}
