/**
 * 🧚‍♀️ How to access:
 *     - import { randomBetween } from '@solidfun/randomBetween'
 */


export function randomBetween(min: number, max: number) {
  return min === max
    ? max
    : Math.floor(Math.random() * (max - min + 1)) + min
}
