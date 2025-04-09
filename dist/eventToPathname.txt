import type { APIEvent, FetchEvent } from './pub/types'

export const eventToPathname = (event: APIEvent | FetchEvent) => (new URL(event.request.url)).pathname
