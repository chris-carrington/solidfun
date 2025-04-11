/**
 * 🧚‍♀️ How to access:
 *     - import { doSubmit } from '@solidfun/doSubmit'
 */


import { FE } from './fe'


/**
 * - Removes the need to add a try / catch to your `onSubmit()` function
 * - Adds form data to the fe object
 * - Adds to messages signals on catch
 * @param evt SubmitEvent
 * @param fe FE
 * @param callback Async anonymous function to call on submit
 */
export async function doSubmit(evt: SubmitEvent, fe: FE, callback: () => Promise<void>) {
  try {
    fe.onSubmitInit(evt)
    await callback()
  } catch(e) {
    fe.catch(e)
  }
}
