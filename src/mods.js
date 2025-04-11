/** 
 * - This is not a list of all the modules (mods / files / exports)
 * - This is a list of mods that can be streamlined during build
 * - More complex mods (b/c they inject current customer data) are not included here and get handled case by case
 * - Private does not mean inaccessible to the user, it mean there is no documented "@solidfun/", "from", "export" for this functionality, BUT this functionaity is required, this helps keep our api simple
 */


export const publicMods = [
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
  ['valibot', 'ts'],
  ['mongoose', 'ts'],
  ['doSubmit', 'ts'],
  ['messages', 'tsx'],
  ['clientOnly', 'ts'],
  ['onAPIEvent', 'ts'],
  ['getMiddleware', 'ts'],
  ['dateTimeFormat', 'tsx'],
  ['contextProvider', 'tsx'],
  ['pathnameToPattern', 'ts'],
  ['onMiddlewareRequest', 'ts'],
]

export const privateMods = [
  ['feFetch', 'ts'],
  ['buildURL', 'ts'],
  ['feMessages', 'ts'],
  ['beMessages', 'ts'],
  ['pathnameToRoute', 'ts'],
  ['eventToPathname', 'ts'],
]
