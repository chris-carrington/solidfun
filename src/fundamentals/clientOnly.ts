/**
 * 🧚‍♀️ How to access:
 *     - import { clientOnly } from '@solidfun/clientOnly'
 */


import { type JSX } from 'solid-js'
import { clientOnly as solidClientOnly } from '@solidjs/start'


/**
 * Create a client only component
 * @param accessor An anonymous function that returns a jsx element
 * @returns A client only component
 */
export function clientOnly(accessor: () => JSX.Element) {
  return solidClientOnly(() => Promise.resolve({ default: accessor }))
}
