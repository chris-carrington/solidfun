/**
 * 🧚‍♀️ How to access:
 *     - import { getMiddleware } from '@solidfun/getMiddleware'
 */


import { onMiddlewareRequest } from './onMiddlewareRequest'
import { createMiddleware, type ResponseMiddleware } from '@solidjs/start/middleware'


/**
 * - Returns a solid start middleware object configured to work w/ Solid Fun
 * - The lower level `onMiddlewareRequest()` is also available if you'd love closer access to your middleware
 * - Example `getMiddleware()` use:
    ```tsx
    import { getMiddleware } from '@solidfun/getMiddleware'

    export default getMiddleware()
    ```
 * @param onBeforeResponse `createMiddleware` takes an `onRequest` and an `onBeforeResponse`, this is the `onBeforeResponse`
 */
export function getMiddleware(options: { onBeforeResponse?: ResponseMiddleware | ResponseMiddleware[] } = {}) {
  return createMiddleware({
    onBeforeResponse: options.onBeforeResponse,
    async onRequest (e) {
      const res = await onMiddlewareRequest(e)
      if (res) return res
    },
  })
}
