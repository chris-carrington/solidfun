/**
 * 🧚‍♀️ How to access:
 *     - import { createOnSubmit } from '@solidfun/createOnSubmit'
 *     - import type { OnSubmitCallback, FormDataFunction } from '@solidfun/createOnSubmit'
 */


import { FE } from './fe'


/**
 * - `createOnSubmit()` does the following for ya:
 *     - Adds a try / catch to your `onSubmit()` function
 *     - Provides a `fd()` function to your `onSubmit()` function to easilly get form data values
 *     - Calls `event.preventDefault()`
 *     - Clears previous messages
 *     - On catch, adds BE messages to FE signals
 * - Example:
      ```ts
      const onSubmit = createOnSubmit(fe, async (fd) => {
        const body = signInSchema.parse({ email: fd('email'), password: fd('password') })
        await fe.POST('/api/sign-in', { body, loadKey: 'signIn' })
      })
      ```
 * @param fe FE
 * @param callback Async anonymous function to call on submit
 */
export function createOnSubmit(fe: FE, callback: OnSubmitCallback) {
  return async (event: SubmitEvent) => {
    try {
      event.preventDefault()

      fe.messages.clearAll()

      const formData = new FormData(event.currentTarget as HTMLFormElement)
      const fd: FormDataFunction = (name: string) => formData.get(name)
      await callback(fd, formData)
    } catch (e) {
      fe.messages.catch(e)
    }
  }
}


/**
 * - When a submit happens, this function happens w/in a try / catch
 * - The first arg is a function that takes a string and w/ that string searches the form's html items. If there is a match, return's it's value, else returns null
 */
export type OnSubmitCallback = (fd: FormDataFunction, formData: FormData) => Promise<any>


/**
 * - With `name`, searches the form's html items. If there is a match, return's it's value, else returns null
 */
export type FormDataFunction = (name: string) => FormDataEntryValue | null
