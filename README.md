![Sloths developing software in a tree](https://i.imgur.com/LognTyf.jpeg)

## 🤓 `Solid Fun` Features!
  - Deploy globally for [free](#-how-to-deploy), 💸 thanks to [Cloudflare](https://www.cloudflare.com/)! ☁️
  - When unminified, `Solid Fun` is still smaller than a single photo, b/c it's less then `180 kB`, requires `0 dependencies` and only builds the `Solid Fun` items you import ***AND*** call! ✅
  - Enjoy `autocomplete` specific to your api's & routes, directly in your editor, when creating links, doing redirects & calling your API! 👷‍♀️
  - A `blazingly-fast` ⚡️ cli that creates new projects 👩‍🍼 and builds the `autocompleting intellisense types` for existing ones! 🏗️
  - Full-stack API, rich with `examples` & `docs`, available in your editor when you hover over `Solid Fun` functions, thanks to [JSDoc](https://jsdoc.app/about-getting-started) comments! 📝
  - Render static page content **immediately**, 💨 stream all else once ready & navigate as SPA! 🧚‍♀️ 
  - Define zero to many `layouts`, that a `route` is placed within! 📥
  - Run `async` functions **before** `route`'s or `api`'s boot! 🔐
  - On ***update***... Only ***update***... What ***updated***  💪 thanks to [Solid](https://www.solidjs.com/)! 🙏
  - Animate lists beautifully, with the `<AnimatedFor />` component! 🌀
  - Auth w/ ease, thanks to the session data helpers: `set`, `get` & `clear`! 🚨 
  - Easilly `define`, `read` & `validate`, `path` or `search` `params`, @ `api`'s or `route`'s! 🪷
  - Create joyful logs w/ `cuteLog()`, example: `cuteLog('❤️ Aloha!', 'cyan', 'bold', 'underline')` or the lower level `cuteString()`, which both include 30+ intellisense options! 💬
## ✨ How may we get started?
- Open a `bash` terminal, & then:
  ```bash
  npx create-solidfun@latest # that was easy 🥳
  ```
- [See what "npx create-solidfun" does automatically 🔮!](https://github.com/chris-carrington/create-solidfun)


## 🧚‍♀️ Got code?!
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
      const onSubmit = createOnSubmit(async (fd) => { // fd() is a form data helper, createOnSubmit() places this callback() into a try/catch & on fe or be catch, <Messages /> get populated below!
        const body = signUpSchema.parse({ // create, validate & parse the request body 🪄
          email: fd('email'),
          password: fd('password')
        }) 

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
    - `Control` + `Space`
    
1. How to reload VS Code?
    - `Command` + `Shift` + `P`
    - Type: `reload window`
    - Press `Enter`

1. How to open VS Code `settings.json`
    - `Command` + `Shift` + `P`
    - Type: `user settings json`
    - Press `Enter`

1. How to get VS Code to create `<div class="example"></div>` on `.example`
    - @ VS Code `settings.json` add:
        ```json
        {
          "emmet.includeLanguages": {
            "typescriptreact": "html",
            "javascriptreact": "html"
          }
        }
        ```
    - Reload VS Code!

1. How to run `code .` in VS Code `bash` & have it open a new VS Code in that directory
    - `Command` + `Shift` + `P`
    - Type: `Shell Command: Install 'code' command in PATH`
    - Press `Enter`

1. How to get the Solid icon for `.tsx` files in VS Code
    - Download the `Symbols` extension by `Miguel Solorio`
    - Bash cd into `~/.vscode/extensions/`
    - Bash cd `miguelsolorio.symbols-` w/ the proper version
    - Bash: `code .`
    - @ `/src/icons/files/` place `solid.svg`
    - @ `/src/symbol-icon-theme.json` w/in `iconDefinitions` place `"solid": { "iconPath": "./icons/files/solid.svg" },`
    - @ `fileExtensions` update `"tsx": "solid",` & anywhere else ya love!
    - @ VS Code `settings.json` add:
        ```js
        "symbols.files.associations": {
          "*.jsx": "solidjs",
          "*.tsx": "solidjs"
        }
        ```
    - Reload VS Code!

1. Gotta errors dictionary?
    -  [Yes please!](https://github.com/chris-carrington/solidfun/blob/main/README_ERRORS.md)
