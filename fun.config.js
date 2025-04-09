// @ts-check 


/** @type {import('solidfun').FunConfig} */
export const config = {
  apiDir: './src/api',
  appDir: './src/app',
  cookieKey: 'fun_cookie',
  sessionDataTTL: 1000 * 60 * 60 * 24 * 3, // 3 days in ms
  envs: [
    { name: 'local', url: 'http://localhost:3000' },
  ]
}


/** 
 * @typedef {Object} SessionData
 * @property {string} userId
 * @property {string} sessionId
 */
