# 🌟 Why Solid Fun?
- 🌀 Fine grained reactivity
- ✅ Type-safe intellisense everywhere
- ❤️ Secure, fast & simple fundamentals
![Kitty software developer](https://i.imgur.com/zcxCkJH.png)



## 🧐 Intellisense everywhere?
- Yes!
- How?
    - `fun build` is a blazingly fast `bash` command that creates types based on the current state of your application
    - These types provide `intellisense` (compile time guidance) at all of the following locations:
      - URL's:
          - `createRouteUrl()`
          - `createApiGetUrl()`
          - `creatApiPostUrl()`
      - Routes:
          - `go()` backend redirect
          - `<A />` frontend anchor component ✅ 
          - `<App />`
      - API:
          - `beGET()`
          - `bePOST()`
          - `fe.GET()`
          - `fe.POST()`



## 💜 Solid fundamentals!
- Stack
    - [Solid Start](https://docs.solidjs.com/solid-start)
- Code (Fundamentals!)
    - Each fundamental below is its own file
    - So Solid Fun is very treeshake ready!
    - & in your editor, *[command + click]* any fundamental below, to not just see the types, but to access the source code! 🙌
    ```tsx
    import { A } from '@solidfun/a' // intellisense anchor component 
    import { go } from '@solidfun/go' // intellisense backend redirect
    import { FE } from '@solidfun/fe' // intellisense api calls
    import { BE } from '@solidfun/be'
    import { App } from '@solidfun/app'
    import { API } from '@solidfun/api' // create api endpoint
    import { pick } from '@solidfun/pick'
    import { clear } from '@solidfun/clear'
    import { env, url } from '@solidfun/env' // get env intel
    import { Route } from '@solidfun/route' // create a route
    import { Layout } from '@solidfun/layout' // create a route layout
    import { Messages } from '@solidfun/messages'
    import { Carousel } from '@solidfun/carousel'
    import { feContext } from '@solidfun/feContext'
    import { clientOnly } from '@solidfun/clientOnly'
    import { mongoConnect } from '@solidfun/mongoConnect' // simple mongo db pool management
    import { getMiddleware } from '@solidfun/getMiddleware' // call async fn's before route and/or api fn's
    import { createOnSubmit } from '@solidfun/createOnSubmit' // lovely form api calls
    import { DateTimeFormat } from '@solidfun/dateTimeFormat'
    import { ContextProvider } from '@solidfun/contextProvider'
    import { MongoModel, InferMongoModel } from '@solidfun/mongoModel' // additional mongo db intellisense
    import { onMiddlewareRequest } from '@solidfun/onMiddlewareRequest'
    import { beFetch, beGET, bePOST, beParse } from '@solidfun/beFetch' // query api's during render, stream dynamic data when ready & use typed data in components ✨
    import { ValibotSchema, InferValibotSchema } from '@solidfun/valibotSchema' // validate & parse data
    import { createRouteURL, createApiGetUrl, creatApiPostUrl } from '@solidfun/url'
    import { setSessionData, getSessionData, clearSessionData } from '@solidfun/session' // auth
    ```
- Purpose
    - Provide Solid Fundamentals, that help create lovely web sites & mobile applications!
    - Share pictures of animal engineers! 😅



![Sloths developing software in a tree](https://i.imgur.com/LognTyf.jpeg)



## 🚀 Quick Start
```bash
# bash
nvm use 22
npm create solid # basic is recommended / typescript is required
npm install @types/node -D
npm install solidfun
```



### Update Typescript Config
- @ `./tsconfig.json`
```json
{
  "paths": {
    "@src/*": ["./src/*"],
    "fun.config": ["./fun.config.js"],
    "@solidfun/*": ["./.solidfun/fundamentals/*"]
  }
}
```



### Update Vite Config
- @ `./app.config.ts`
```ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@solidjs/start/config'


const cwd = path.dirname(fileURLToPath(import.meta.url))


export default defineConfig({
  vite: { // vite config goes here
    resolve: {
      alias: {
        '@src': path.resolve(cwd, 'src'),
        '@solidfun': path.resolve(cwd, '.solidfun/fundamentals'),
        'fun.config': path.resolve(cwd, './fun.config.js'),
      }
    }
  }
})
```



### Create a `.env` file:
- This password is used to encrypt/decrypt cookie values
- It must be at least 32 characters long b/c of how web crypto works, example:
```toml
SESSION_CRYPT_PASSWORD=a94fc8e3b1024d2cc99ee0e874a4bc79 # please set new password here
```



### 🗂️ Create the folders
1. `./src/app/`
    - Route & layout `tsx` files go here
2. `./src/api/`
    - GET & POST functions go here
- Recomendations:
    - Don't use the `./src/routes` folder for your `app` or `api` please
    - We recommend seperate folders for swift searching bt if the `app` and `api` folders are the same folder, all good, all will still work!


![Animals developing software in the safari](https://i.imgur.com/9WBk7EM.png)



### 🥳 Set fun config
- @ `./fun.config.js`
```ts
// @ts-check 


/** @type {import('solidfun').FunConfig} */
export const config = {
  apiDir: './src/api',
  appDir: './src/app',
  cookieKey: 'fun_cookie',
  sessionDataTTL: 1000 * 60 * 60 * 24 * 3, // 3 days in ms
  envs: [
    { name: 'local', url: 'http://localhost:3000' },
  ],
  plugins: {
    solid: true,
  }
}


/** 
 * @typedef {Object} SessionData
 * @property {string} userId
 * @property {string} sessionId
 */
```
- Explaining the fun config above:
    - A fundamental is a file that has helpful stuff in it
    - A group of these fundamentals is a plugin
    - To gain access to fundamentals, install plugins
    - To install plugins, set `config.plugins[plugin]` to `true`
    - The only config prop that is required is `plugins` and if `plugins.solid` is `true` a `SessionData` type is required
    - The `SessionData` type:
        - Tells your app the shape of the data you'd love to store in sessions
        - Thanks to Solid Start users always have a session, and you can optionally store data in that session
        - The data you store in a session could be a `name` or `email`, we recommend an `id` or 2 and to get the rest of the data about a user from the database
    - The  `./fun.config.js` file is not a typescript file and is a javascript file b/c this file is read from the command line thanks to `fun build` and it's easier to run js files in the command line then ts files. But thanks to the `// @ts-check ` comment on line 1 above, & the jsdoc comments, there is still intellisense in this file! 🙌


### 😅 Test a build
```bash
fun build local # if you did: npm i -g solidfun (fastest builds)
npx fun build local # if you did: npm i solidfun
```



### Create a route
- @ `./src/app/Test.tsx`:
```tsx
import { Route } from '@solidfun/route'

export default new Route({
  path: '/test',
  component() {
    return <h1>Winning! ✅</h1>
  }
})
```


### Bind `<App />` component
```tsx
import './app.css' // vite css relative paths = best
import { App } from '@solidfun/app'

export default () => <App /> // in your editor command click the <App /> component, if wondering where are the routes, "fun build local" 🧚‍♀️
```



![Lion's using app's at Pride Rock](https://i.imgur.com/37aoJkk.png)


### Create primary api endpoint
- @ `./src/routes/api/[...api].ts`
- Thanks to the Solid Start `<FileRoutes />` component, all calls to `/api` will go through the fn's placed here
```tsx
import { gets, posts } from '@solidfun/apis'
import type { APIEvent } from '@solidfun/types'
import { onAPIEvent } from '@solidfun/onAPIEvent'


export async function GET(event: APIEvent) {
  'use server'
  return await onAPIEvent(event, gets)
}


export async function POST(event: APIEvent) {
  'use server'
  return await onAPIEvent(event, posts)
}

```



### Create an api endpoint
- @ `./src/api/test.ts`
```tsx
import { API } from '@solidfun'


export const GET = new API({ // POST is also available
  path: '/api/test/id?', // optional / required path params available @ routes & api endpoints
  async fn () {
    return { aloha: true }
  }
})
```




![Kitties developing software](https://i.imgur.com/Ao8xTG5.png)



### Update package.json
```
"scripts": {
  "dev": "fun build local && vinxi dev",
}
```



### 🙌 Start the app!
- `npm run dev`
- Then navigate to `http://localhost/3000/test` or `http://localhost/3000/api/test` 💛



![Bunnies writing code](https://i.imgur.com/d0wINvM.jpeg)



### Cleanup 
- Delete the `./src/routes/about.tsx` file
- Delete the `./src/routes/index.tsx` file
- Delete the `./src/components` folder
- Create a `./src/lib` folder
    - Lib is short for library
    - `./src/lib` holds common variables, functions & components
- Recommended `Solid Fun` file & folder organization!
    - A file that does not fit into any other current folders goes in `./src/lib`
    - If multiple items relate put em in a folder in `./src`
    - So files in `./src/lib` and folders in `./src`
    - So then when you open `./src` you'll see all your stuff & head to the library for helpful unique items!



### Create middleware
- In Solid Start, if a return is made in a middleware function, that return is given to the client as a response & if a return is not done, the api or route fn is called
- Solid Fun provides a way to align w/ this functionality via the `b4` prop that is available when creating `API`'s and `Route`'s
- To ensure `b4` async functions are called, the easieast option is w/ `getMiddleware()` and the most flexible option is with `onMiddlewareRequest()`. Here is an example of both @ `./src/lib/middleware.ts`:
    - Adding middleware w/ the easiest option, 🧚‍♀️ `getMiddleware()`
    - This is the option we recommend starting with:
        ```tsx
        import { getMiddleware } from '@solidfun/getMiddleware'

        export default getMiddleware()
        ```
    - Adding middleware w/ the most flexible option, 🧘‍♀️ `onMiddlewareRequest()`
    - Only recommended if you'd like to add more functionality to your application middleware then what `getMiddleware()` does:
        ```tsx
        import { createMiddleware } from '@solidjs/start/middleware'
        import { onMiddlewareRequest } from '@solidfun/onMiddlewareRequest'

        export default createMiddleware({
          async onRequest (e) {
            const res = await onMiddlewareRequest(e) // aligns event w/ api or route & if there is a b4() fn defined, calls it

            // option to fill in w/ custom business logic

            if (res) return res // this is the default that getMiddleware() does, to only return to the client if b4() response is truthy
          }

          async onBeforeResponse (e) {
            // option to fill in w/ custom business logic
          }
        })
        ```
    - So either the `getMiddleware()` or the `onMiddlewareRequest()` option must be implemented to align Solid middleware w/ Solid Fun `b4()`
    - 🚨 Important note: If returning from `onRequest` it must be a `Response` object. So if a redirect is desired use [Response.redirect](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect_static) or the solid js `redirect()` which does that for us or the Solid Fun `go()` which calls `redirect()` and provides intellisense!
    - If using the `onMiddlewareRequest()` option, some additional information should be known about SolidJS middleware so here is information about that:
        - [Middleware](https://docs.solidjs.com/solid-start/advanced/middleware)
        - [Create Middleware](https://docs.solidjs.com/solid-start/reference/server/create-middleware#createmiddleware)
    ![snow](https://image.cdn2.seaart.me/2025-04-08/cvqcrgle878c73dnstc0-1/fe4b1143be1635a95c0a23ecefa797db_high.webp)
    - 🚨 Important last Step! @ `./app.config.ts`, tell Solid where the middleware file is, with something like: `middleware: './src/lib/middleware.ts'`
    - Full app config w/ middleware example:
        ```ts
        import path from 'node:path'
        import { fileURLToPath } from 'node:url'
        import { defineConfig } from '@solidjs/start/config'


        const cwd = path.dirname(fileURLToPath(import.meta.url))


        export default defineConfig({
          middleware: './src/lib/middleware.ts',
          vite: {
            resolve: {
              alias: {
                '@root': path.resolve(cwd),
                '@lib': path.resolve(cwd, 'src/lib'),
                '@solidfun': path.resolve(cwd, '.solidfun/fundamentals'),
              }
            }
          }
        })
        ```
        - To test this add @ `./src/app/Index.tsx`
        ```tsx
        import { go } from '@solidfun/go'
        import { Route } from '@solidfun/route'
        import type { GoResponse } from '@solidfun/types'


        export default new Route({
          path: '/',
          async b4(): GoResponse {
            return go('/test')
          }
        })
        ```
    - Restart the dev server (which updates the `<App />` component)
    - Navigate to http://localhost:3000
    - Notice the redirect to `/test` 🙌
    ![dino](https://image.cdn2.seaart.me/2025-04-08/cvqr2i5e878c73dq5i7g-1/5029da0352743be5881c0313f5d77c53_high.webp)



### Create a Layout
- For a group of routes, layouts allow us a way to:
    - Create html elements to wrap them
    - Import styling that they may all share
    - Get data and share it between them
- @ `./src/app/Guest/Guest.css` create css for all routes in the layout
    ```css
    .guest { background-color: pink; }
    ```
- @ `./src/app/Guest/Guest.Layout.tsx`
    ```tsx
    import { Layout } from '@solidfun/layout'
    import './Guest.css' // when it comes to css, vite works best w/ relative import paths


    export default new Layout({
      component({ children }) {
        return <>
          <div class="guest">
            <input type="text" />  {/* type in here, then swap between pages AND the text remains! 🙌 */}
            {children}
          </div>
        </>
      }
    })
    ```
- @ `./src/app/Guest/SignIn.tsx`
    ```tsx
    import { A } from '@solidfun/a'
    import { Title } from '@solidjs/meta'
    import { Route } from '@solidfun/route'
    import GuestLayout from './Guest.Layout'


    export default new Route({
      layout: GuestLayout,
      path: '/sign-in',
      component() {
        return <>
          <Title>Sign In</Title>
          <h1>Sign In</h1>
          <A path="/forgot">Forgot password?</A>
        </>
      }
    })
    ```
- @ `./src/app/Guest/Forgot.tsx`
    ```tsx
    import { A } from '@solidfun/a'
    import { Title } from '@solidjs/meta'
    import { Route } from '@solidfun/route'
    import GuestLayout from './Guest.Layout'


    export default new Route({
      layout: GuestLayout,
      path: '/forgot',
      component() {
        return <>
          <Title>Forgot</Title>
          <h1>Forgot</h1>
          <A path="/sign-in">Sign In?</A>
        </>
      }
    })
    ```
    - Restart the dev server (which updates the `<App />` component)
    - Now that the `<App />` component knows about your new routes, w/ the `<A />` component feel free to delete the path and then while your insertion point is between the path `""` press *[control + space]* to get intellisense!
    - Navigate to http://localhost:3000/sign-in
    - Type into the layout input
    - Navigate between pages and notice how the layout did not re render b/c the input text remains! 🙌
![beach](https://image.cdn2.seaart.me/2025-04-08/cvqjh1de878c73fm4vl0-1/1792b2f7efdeefa88ce17bab626a1cec_high.webp)
