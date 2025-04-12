/** 
 * - This is not a list of all fundamentals (modules / files that have exports)
 * - This is a list of fundamentals that are easy to copy during build
 * - More complex fundamentals are not included here and get handled case by case
 * - fundamentalHelpers won't be a "@solidfun/" fundamental, but it's functionality they require
 */


export const fundamentals = [
  ['a', 'tsx'],
  ['fe', 'ts'],
  ['be', 'ts'],
  ['go', 'ts'],
  ['api', 'ts'],
  ['url', 'ts'],
  ['vars', 'ts'],
  ['pick', 'ts'],
  ['route', 'ts'],
  ['clear', 'ts'],
  ['layout', 'ts'],
  ['beFetch', 'ts'],
  ['session', 'ts'],
  ['submit', 'tsx'],
  ['messages', 'tsx'],
  ['feContext', 'tsx'],
  ['clientOnly', 'ts'],
  ['onAPIEvent', 'ts'],
  ['mongoModel', 'ts'],
  ['mongoConnect', 'ts'],
  ['valibotSchema', 'ts'],
  ['getMiddleware', 'ts'],
  ['createOnSubmit', 'ts'],
  ['dateTimeFormat', 'tsx'],
  ['contextProvider', 'tsx'],
  ['pathnameToPattern', 'ts'],
  ['onMiddlewareRequest', 'ts'],
]

export const fundamentalHelpers = [
  ['feFetch', 'ts'],
  ['buildURL', 'ts'],
  ['feMessages', 'ts'],
  ['beMessages', 'ts'],
  ['pathnameToRoute', 'ts'],
  ['eventToPathname', 'ts'],
]
