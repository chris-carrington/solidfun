/**
 * 🧚‍♀️ How to access:
 *     - import { setSessionData, getSessionData, clearSessionData } from '@solidfun/session'
 */


import { useSession } from 'vinxi/http'
import { config, type SessionData } from '../../fun.config'



/** 
 * - Thanks to Solid Start, all site accessors, aka all users, will always have a browser cookie
 * - Within this encrypted browser cookie is an object that Solid calls a session
 * - `session.data` is an object that can hold whatever we want
 * - @ `session.data[sessionDataKey]` we hold the sessionData
 * - When sessionData is set, cleared and what is in it is up to you but it's shape must be specified in the `./fun.config.js`
 */
export async function setSessionData(sessionData: SessionData): Promise<void> {
  await _setSessionData(await getSession(), sessionData)
}



/** 
 * - Thanks to Solid Start, all site accessors, aka all users, will always have a browser cookie
 * - Within this encrypted browser cookie is an object that Solid calls a session
 * - `session.data` is an object that can hold whatever we want
 * - @ `session.data[sessionDataKey]` we hold the sessionData
 * - When sessionData is set, cleared and what is in it is up to you but it's shape must be specified in the `./fun.config.js`
 * - `SessionData`: The shape of this data, defined @ `./fun.cofig.js`
 * - Returns: `null` if not defined or `SessionData` if defined
 */
export async function getSessionData(): Promise<null | SessionData> {
  const session = await getSession()
  const strSessionData = session.data[sessionDataKey] // session data as a string
  return strSessionData ? JSON.parse(strSessionData) : null // JSON.parse() string session data
}



/** 
 * - Thanks to Solid Start, all site accessors, aka all users, will always have a browser cookie
 * - Within this encrypted browser cookie is an object that Solid calls a session
 * - `session.data` is an object that can hold whatever we want
 * - @ `session.data[sessionDataKey]` we hold the sessionData
 * - When sessionData is set, cleared and what is in it is up to you but it's shape must be specified in the `./fun.config.js`
 * - @ session.data[sessionDataKey] we hold the SessionData
 * - `clearSessionData()` sets `session.data[sessionDataKey]` to `null`
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
