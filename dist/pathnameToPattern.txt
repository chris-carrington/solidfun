/**
 * 🧚‍♀️ How to access:
 *     - import { pathnameToPattern } from '@solidfun/pathnameToPattern'
 */


/**
 * - Replaces route parameters (:param and :param?) in a pathname w/ regex patterns
 * - Help determines what routes or api's to access
 */
export function pathnameToPattern(pathname: string): RegExp {
  const regexString = pathname
    .replace(/\/:\w+\?/g, '(?:/([^/]+))?') // Handle optional params
    .replace(/:\w+/g, '([^/]+)'); // Handle required params

  return new RegExp(`^${regexString}$`);
}
