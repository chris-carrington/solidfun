/**
 * 🧚‍♀️ How to access:
 *     - import { getMiddleware } from '@solidfun/getMiddleware'
 */


import { callB4 } from './callB4'
import { createMiddleware } from '@solidjs/start/middleware'


/**
 * - How to use: `export default getMiddleware()`
 * - In Solid Start if middleware returns that response is given to the client
 * - Solid Fun aligns w/ this functionality to do `callB4()` calls during middleware
 * - `getMiddleware()` returns a middleware object with all this wired up
 * - If you would love additional logic in your middleware while maintaining `callB4()` logic, just do as seen in the `getMiddleware()` by:
 *     - Creating the middleware w/ `createMiddleware()`
 *     - On request get the `callB4()` `response`
 *     - & if the `response` is truthy return it
 * - & then if then you'd love to add more to your middeware, yay, all good! 🙌
 */
export function getMiddleware() {
  return createMiddleware({
    async onRequest (e) {
      const res = await callB4(e)
      if (res) return res
    }
  })
}
