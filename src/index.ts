/**
 * 🧚‍♀️ How to access:
 *     - import type { FunConfig } from 'solidfun'
 */


/**
 * - Configure Solid Fun!
 * - FAQ:
 *     - Where to place
 *         - `./fun.config.js`
 *     - Why is `fun.config.js` a javascript file?
 *         - The cli does an `import()` of `fun.config.js`, and it's requires less for all to download to run js files in the terminal
 *     - How to import type into config file for type safety
 *         - Ensure the file starts with an `@ts-check` comment on the first line w/ nothing else on that line
 *         - Put the JSDOC comment: `@type {import('solidfun').FunConfig}` directly above the line `export const config = {`
 *     - How to import the value
 *         - `import { config } from '@root/fun.config.js'`
 *     - Why is this type in index.ts?
 *         - So this type is available before types.ts aka @solidfun/types is created
*/
export type FunConfig = {
  apiDir?: string,
  appDir?: string,
  cookieKey?: string,
  sessionDataTTL?: number,
  plugins: {
    solid?: boolean,
    valibot?: boolean,
    mongoose?: boolean,
  },
  envs?: { name: string, url: string }[],
}
