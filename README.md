![Sloths developing software in a tree](https://i.imgur.com/LognTyf.jpeg)

## 🧐 Why create w/ `Solid Fun`?
-  B/c `Solid Fun` helps us find 🐛's early!


## 🧙‍♂️ How please?
- **`fun build`** creates our **app specific** type definitions 
-  & code editors light up based on these definitions
-  So building links, calling APIs, or redirecting is **type-safe**! 🙌



## 🔮 What is the tech stack?
  - [Solid Start](https://docs.solidjs.com/solid-start) 🙏


## ✨ How may we get started?
- Open a `bash` terminal, & then:
  ```bash
  npm create solidfun # that was easy 🥳
  ```


## 🧚‍♀️ What's included please?
- 💚 Lovely API Syntax
  ```tsx
  import { API } from '@solidfun/api'


  export const GET = new API({
    path: '/api/aloha',
    async fn() {
      return { aloha: true }
    }
  })
  ```
- 💖 Lovely Route Syntax
  ```tsx
  import { Title } from '@solidjs/meta'
  import RootLayout from '../RootLayout'
  import { Route } from '@solidfun/route'
  import WelcomeLayout from './WelcomeLayout'


  export default new Route({
    path: '/',
    layouts: [RootLayout, WelcomeLayout],
    component() {
      return <>
        <Title>🏡 Home</Title>
        <h1>Home 🏡</h1>
      </>
    }
  })
  ```
- 💛 Lovely Feature Blitz:
    1. Super fast **HMR** thanks to [Vite](https://vite.dev/)! 💜
    1. Easilly share data between components and/or pages! 🌀
    1. Run `async` functions **before** `route`'s or `api`'s boot! ✅
    1. Define zero to many `layouts` a `route` may sit within! 📥
    1. On ***update***... Only ***update***... ***Updated*** locations...! 🥹 thanks to [Solid](https://www.solidjs.com/)!
    1. Provides 3 simple functions, `set`, `get` & `clear` to help simplify auth! 🚨 
    1. App specific `editor guidance` when creating links, calling API's & doing redirects! 👷‍♀️
    1. Render static page content **immediately**, 💨 stream all else once ready & navigate like a SPA! 🧚‍♀️ 
    1. Simply, for `api`'s or `route`'s, `define`, `read` & `validate`, `one` to `many`, `optional` or `required`, `path` or `search` `params`... 🤯
    ![Squirrel Engineer](https://i.imgur.com/V5J2qJq.jpeg)

## 🤓 What is `Solid Fun`'s Purpose?
- To provide **Solid Fundamentals**... That help create lovely web sites & mobile applications!
- Share pictures of animal engineers! 🤣
- & eventually, figure out how to stream the Akashic Records into an app! 😅


## 🚀 How to Deploy!
- Cloudflare offers free global hosting!
    - Create a GitHub account or Sign in
    - Push to a public or private repository
    - Create a Cloudlfare account or Sign in
    - Navigate to `Workers & Pages`
    - Add you Github account information
    - Do an initial deploy just to get an env url
    - Add the env url to your `./fun.config.js`
    - Example:
      ```js
      envs: [
        { name: 'local', url: 'http://localhost:3000' },
        { name: 'prod', url: 'https://example.solidfun.workers.dev' },
      ]
      ```
    - 💖 Push to main, aka deploy!

![Bunnies writing code](https://i.imgur.com/d0wINvM.jpeg)
