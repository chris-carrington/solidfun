/**
 * 🧚‍♀️ How to access:
 *     - import { setSessionData, getSessionData, clearSessionData } from '@solidfun/session'
 */


import { useSession } from 'vinxi/http'
import { config, type SessionData } from 'fun.config'



/** 
 * - `setSessionData()` sets `session.data[sessionDataKey]` to `sessionData`
 * - Thanks to Solid Start, all site accessors, have a browser cookie that has a key and value
 * - The cookie key is configured  @ `./fun.config.js` and the value is an encrypted & stringified object that Solid calls a session
 * - `session.data` is an object that can hold whatever we want. @ `session.data[sessionDataKey]` we hold the sessionData
 * - The `SessionData` type is configured via JSDOC @ `./fun.config.js`
 * - & session data is added onto each request @ `onMiddlewareRequest()` 
 */
export async function setSessionData(sessionData: SessionData): Promise<void> {
  await _setSessionData(await getSession(), sessionData)
}



/** 
 * - `getSessionData()` returns: `null` if not defined or `SessionData` if defined
 * - It is meant to be an inner function w/ business logic wrapped around it, w/in your application, for example:
    ```tsx
    import { go } from '@solidfun/go'
    import type { SessionData } from 'fun.config'
    import { _getSessionData } from '@solidfun/session'


    export async function parseSessionData(): Promise<SessionData> {
      const sessionData = await _getSessionData()

      if (!sessionData) throw go('/sign-in/:messageId?', {messageId: '1'})

      return sessionData
    }
```
 * - Next anywhere => `import { parseSessionData } from '@src/lib/parseSessionData'`
 * - The `SessionData` type is configured via JSDOC @ `./fun.config.js`
 */
export async function getSessionData(): Promise<null | SessionData> {
  const session = await getSession()
  const strSessionData = session.data[sessionDataKey] // session data as a string
  return strSessionData ? JSON.parse(strSessionData) : null // JSON.parse() string session data
}



/** 
 * - `clearSessionData()` sets `session.data[sessionDataKey]` to `null`
 * - Thanks to Solid Start, all site accessors, have a browser cookie that has a key and value
 * - The cookie key is configured  @ `./fun.config.js` and the value is an encrypted & stringified object that Solid calls a session
 * - `session.data` is an object that can hold whatever we want. @ `session.data[sessionDataKey]` we hold the sessionData & `clearSessionData()` sets this value to null
 */
export async function clearSessionData(): Promise<void> {
  await _setSessionData(await getSession(), null)
}



const sessionDataKey = 'sessionData'



async function _setSessionData<T extends SessionData>(session: SolidStartSession, sessionData: null | T): Promise<void> {
  await session.update((d) => (d[sessionDataKey] = sessionData ? JSON.stringify(sessionData) : null))
}



async function getSession(): Promise<SolidStartSession> {
  if (!process.env.SESSION_CRYPT_PASSWORD) throw new Error('Please set process.env.SESSION_CRYPT_PASSWORD')
  return await useSession<SessionData>({ name: config.cookieKey, password: process.env.SESSION_CRYPT_PASSWORD })
}



type SolidStartSession = Awaited<ReturnType<typeof useSession>>
