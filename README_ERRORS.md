# 🚨 Error Dictionary! 😅

1. `TypeError: Comp is not a function at createComponent`
    - Ensure `app.tsx` has `import { createApp } from '@solidfun/app'` and `export default createApp()`
1. `Error: <A> and 'use' router primitives can be only used inside a Route.`
    - This is typically caused by something in the default export function @ `app.tsx` that should not be there, like `useParams()` or `useLocation()`. This function must only have items like  `<Router />`, `<FileRoutes />` or `<Route />`. Then w/in the component functions of the route or layout we may use router primatives
1. `Cannot read properties of null (reading 'push') @ Effects.push.apply(Effects, e);` 
    1. Delete `Solid Start` cookie
    1. Restart app
    1. Launch in new browser tab
