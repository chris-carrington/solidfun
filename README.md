![Sloths developing software in a tree](https://i.imgur.com/LognTyf.jpeg)

## 🧐 Why create w/ `Solid Fun`?
- B/c Solid Fun helps us find 🐛's early!


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
- Or, [do what "npm create solidfun" does manually!](https://github.com/chris-carrington/create-solidfun)


## 🧚‍♀️ What's included please?
- 💜 Lovely API Syntax
  ```tsx
  import { API } from '@solidfun/api'


  export const GET = new API({
    path: '/api/aloha',
    async fn() {
      return { aloha: true }
    }
  })
  ```
- ❤️ Lovely Layout Syntax
  ```tsx
  import './Guest.css'
  import GuestNav from './GuestNav'
  import { Layout } from '@solidfun/layout'


  export default new Layout({
    component({ children }) {
      return <>
        <div class="guest">
          <GuestNav />
          {children}
        </div>
      </>
    }
  })

  ```
- 💚 & Lovely Route Syntax!
  ```tsx
  import { Title } from '@solidjs/meta'
  import { guestB4 } from '@src/lib/b4'
  import RootLayout from '../RootLayout'
  import { Route } from '@solidfun/route'
  import GuestLayout from './Guest.Layout'
  import { Submit } from '@solidfun/submit'
  import { Messages } from '@solidfun/messages'
  import { signUpSchema } from '@src/schemas/SignUpSchema'
  import { createOnSubmit } from '@solidfun/createOnSubmit'


  export default new Route({
    b4: guestB4,
    path: '/sign-up',
    layouts: [RootLayout, GuestLayout],
    component({ fe }) {
      const onSubmit = createOnSubmit(async (fd) => {
        const body = signUpSchema.parse({ email: fd('email'), password: fd('password') }) // create, validate & parse the request body in 1 line 🪄

        await fe.POST('/api/sign-up', { body, bitKey: 'signUp' }) // a bit is a boolean signal 💃
      })

      return <>
        <Title>Sign Up</Title>

        <form onSubmit={onSubmit}>
          <input placeholder="Email" name="email" type="email" />
          <Messages name="email" /> {/* shows one/many messages, from signUpSchema.parse() and/or fe.POST(), for just the email input! 🚀 */}

          <input placeholder="Password" name="password" type="password" />
          <Messages name="password" />

          <div class="footer">
            <Submit label="Sign Up" bitKey="signUp" /> {/* Uses fe.bits.isOn('signUp') to show a loading indicator! 🏋️‍♂️ */}
          </div>
        </form>
      </>
    }
  })
  ```
## 🦋 Got more `Solid Fun` features?!
  - Fast **HMR** thanks to [Vite](https://vite.dev/)! 💜
  - Deploy globally for [free](#-how-to-deploy), 💸 thanks to [Cloudflare](https://www.cloudflare.com/)! ☁️
  - Run `async` functions **before** `route`'s or `api`'s boot! 🔐
  - Define zero to many `layouts`, for a `route` to sit within! 📥
  - Just 3 functions, `set`, `get` & `clear`, to help simplify auth! 🚨 
  - On ***update***... Only ***update***... What ***updated***...! 💪 thanks to [Solid](https://www.solidjs.com/)!
  - A full stack api, that's filled with [JSDoc](https://jsdoc.app/about-getting-started) commenets, 🙌 for in editor documentation! 🙏
  - App specific `autocomplete`, when creating links, calling API's and doing redirects! 👷‍♀️
  - Render static page content **immediately**, 💨 stream all else once ready & navigate like an SPA! 🧚‍♀️ 
  - Simply `define`, `read` & `validate`, `one` to `many`, `optional` or `required`, `path` or `search` `params`, @ `api`'s or `route`'s... 🪷
  - A `typesafe` config, a ⚡️ `blazingly-fast` cli & a beautifully tree shaked build, 📦 so the only `Solid Fun` items in your build, are items being used! ✅
  ![Squirrel Engineer](https://i.imgur.com/V5J2qJq.jpeg)

## 🤓 What is `Solid Fun`'s Purpose?
- To provide **Solid Fundamentals**... That help create lovely web sites & mobile applications!
- Share pictures of animal engineers! 🤣
- & eventually, figure out how to stream the Akashic Records into an app! 😅


## 🚀 How to Deploy!
- [Cloudflare](https://www.cloudflare.com/) offers free global hosting! 🥹
    - Create a GitHub account or Sign in
    - Push to a public or private repository
    - Create a Cloudlfare account or Sign in
    - Navigate to `Workers & Pages`
    - Add you Github account information
    - Do an initial push to main, aka deploy, just to get an env url
    - Add the env url to your `./fun.config.js`
    - Example:
      ```js
      envs: [
        { name: 'local', url: 'http://localhost:3000' },
        { name: 'prod', url: 'https://example.solidfun.workers.dev' },
      ]
      ```
    - 💖 Deploy!

![Bunnies writing code](https://i.imgur.com/d0wINvM.jpeg)


## 💖 FAQ
1. How to show intellisense dropdown in VS Code?
    1. `Control` + `Space`
    
1. How to reload VS Code?
    1. `Command` + `Shift` + `P`
    1. Type: `reload window`
    1. Press `Enter`

1. How to open VS Code `settings.json`
    1. `Command` + `Shift` + `P`
    1. Type: `user settings json`
    1. Press `Enter`

1. How to get VS Code to create `<div class="example"></div>` on `.example`
    1. @ VS Code `settings.json` add:
        ```json
        {
          "emmet.includeLanguages": {
            "typescriptreact": "html",
            "javascriptreact": "html"
          }
        }
        ```
    1. Reload VS Code!

1. How to run `code .` in VS Code `bash` & have it open a new VS Code in that directory
    1. `Command` + `Shift` + `P`
    1. Type: `Shell Command: Install 'code' command in PATH`
    1. Press `Enter`

1. How to get the Solid icon for `.tsx` files in VS Code
    1. Download the `Symbols` extension by `Miguel Solorio`
    1. Bash cd into `~/.vscode/extensions/`
    1. Bash cd `miguelsolorio.symbols-` w/ the proper version
    1. Bash: `code .`
    1. @ `/src/icons/files/` place `solid.svg`
    1. @ `/src/symbol-icon-theme.json` w/in `iconDefinitions` place `"solid": { "iconPath": "./icons/files/solid.svg" },`
    1. @ `fileExtensions` update `"tsx": "solid",` & anywhere else ya love!
    1. @ VS Code `settings.json` add:
        ```js
        "symbols.files.associations": {
          "*.jsx": "solidjs",
          "*.tsx": "solidjs"
        }
        ```
    1. Reload VS Code!

1. Gotta errors dictionary?
    1. [Yes!](https://github.com/chris-carrington/solidfun/blob/main/README_ERRORS.md)
