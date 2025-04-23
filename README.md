### 🧐 Why Solid Fun?
-  B/c `Solid Fun` helps us identify 🐛's early!


### 🧙‍♂️ How please?
- **`fun build`** creates app specific type definitions 
-  & code editors light up based on these types
-  So building links, calling APIs, or redirecting is always type-safe!



### 🔮 What is the tech stack?
  - [Solid Start](https://docs.solidjs.com/solid-start)



### ✨ How to begin?
```bash
npm create solidfun # that was easy 🥳
```


### 🧚‍♀️ What is included?
  - Each fundamental (module) below is its own file
  - So `Solid Fun` is very treeshake ready!
  - & in your editor, *[command + click]* any fundamental below, to not just see the types, but to access the source code! 🙌
    ```tsx
    import { A } from '@solidfun/a' // intellisense anchor component 
    import { go } from '@solidfun/go' // intellisense backend redirect
    import { FE } from '@solidfun/fe' // intellisense api calls
    import { BE } from '@solidfun/be'
    import { App } from '@solidfun/app'
    import { API } from '@solidfun/api' // create api endpoint
    import '@solidfun/shimmer.styles.css' // modern shimmer styles
    import { pick } from '@solidfun/pick'
    import '@solidfun/loadSpin.styles.css'
    import { clear } from '@solidfun/clear'
    import { env, url } from '@solidfun/env' // get env intel
    import { Route } from '@solidfun/route' // create a route
    import { Layout } from '@solidfun/layout' // create a route layout
    import { lorem } from '@solidfun/lorem'
    import { holdUp } from '@solidfun/holdUp'
    import { Messages } from '@solidfun/messages'
    import { Carousel } from '@solidfun/carousel'
    import { feContext } from '@solidfun/feContext'
    import { clientOnly } from '@solidfun/clientOnly'
    import { ParamEnums, InferEnums } from '@solidfun/paramEnums' // simplify url param enums
    import { parseNumber } from '@solidfun/parseNumber' // simple number validation
    import { randomBetween } from '@solidfun/randomBetween'
    import { mongoConnect } from '@solidfun/mongoConnect' // simple mongo db pool management
    import { getMiddleware } from '@solidfun/getMiddleware' // call async fn's before route and/or api fn's
    import { createOnSubmit } from '@solidfun/createOnSubmit' // lovely form api calls
    import { DateTimeFormat } from '@solidfun/dateTimeFormat'
    import { ContextProvider } from '@solidfun/contextProvider'
    import { loremWords, loremParagraphs } from '@solidfun/lorem'
    import { MongoModel, InferMongoModel } from '@solidfun/mongoModel' // additional mongo db intellisense
    import { onMiddlewareRequest } from '@solidfun/onMiddlewareRequest'
    import { beAsync, beGET, bePOST, beParse } from '@solidfun/beAsync' // query api's during render, stream dynamic data when ready & use typed data in components ✨
    import { ValibotSchema, InferValibotSchema } from '@solidfun/valibotSchema' // validate & parse data
    import { createRouteURL, createApiGetUrl, creatApiPostUrl } from '@solidfun/url'
    import { setSessionData, getSessionData, clearSessionData } from '@solidfun/session' // auth
    ```


### 🤓 What is our Purpose?
  - Provide Solid Fundamentals, that help create lovely web sites & mobile applications!
  - Share pictures of animal engineers! 😅



![Sloths developing software in a tree](https://i.imgur.com/LognTyf.jpeg)



### 🚀 How to Deploy!
- Cloudflare offers free global hosting!
    - Create a GitHub account or Sign in
    - Push to a public or private repository
    - Create a Cloudlfare account or Sign in
    - Navigate to `Workers & Pages`
    - Add you Github account information
    - Do an initial deploy just to get an env url
    - Add the env url to yo `./fun.config.js`
    - Example:
      ```js
      envs: [
        { name: 'local', url: 'http://localhost:3000' },
        { name: 'prod', url: 'https://example.solidfun.workers.dev' },
      ]
      ```
    - 💖 Push to main, aka deploy!

![Bunnies writing code](https://i.imgur.com/d0wINvM.jpeg)
