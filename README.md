![Sloths developing software in a tree](https://i.imgur.com/LognTyf.jpeg)

## 🤓 `Solid Fun` Features!
### Standard
1. [Free](#-how-to-deploy) global hosting, 💸 thanks to [Cloudflare](https://www.cloudflare.com/)! ☁️
1. Smooth `SPA` navigation! 🧚‍♀️ 
1. On ***update***... Only ***update***... What ***updated***  💪 thanks to [Solid](https://www.solidjs.com/)! 🙏
1. **`In editor`**, **`autocomplete`** & **`typesafety`** @:
    - Config
    - Anchor Tags
    - Frontend (FE) or Backend (BE) Redirects
    - Requests that start server side (be), to your api, during page load
    - Requests that start in the browser (fe), to your api, after page load

### Security
1. Smaller than a photo 📸 b/c even when **unminified** `Solid Fun` is less then **`150 kB`**, requires **`0 dependencies`** & features an automatically & beautifully, tree shaked API! 🙌
1. Simplify cookies, sessions & auth, thanks to the `set()`, `get()` & `clear()`, session data helpers! 🚨 
1. Like middleware, run `async` functions **before** your `route`'s or `api`'s boot! 🔐

### Routes & API
1. Define 0 to many `layouts` for `routes` to be placed within! 📥 
1. `Define`, `read` and `validate`, **path or search** `params`, at **api's or route's**! 🪷
1. Enjoy fast initial page load times, b/c all static content is in the initial HTML! 😊
1. Have static content available immediately, make multiple api calls during a page reder, and as each dynamic promise resolves (ex: database data), stream that item back to the frontend! 🎉
1. So when Request processing begins on the server, so does dynamic data gathering. If dynamic data is ready before the page has been built that dynamic data will be included in the initial page load and all else will stream once that item is ready! 💫

### Getting Started
1. Create new projects 👩‍🍼 and build the **`autocompleting intellisense types`** for existing ones 🏗️ wih our `blazingly-fast cli`! ⚡️
1. A super simple api, with tons of [JSDOC](https://jsdoc.app/) comments for in editor docs & examples  when hovering over `Solid Fun` **types, functions and components**! 🤓

### Honorable Mentions
1. `<AnimatedFor />`: Animate your lists beautifully & smoothly with CSS animations! 🌀
1. `<Messages />` When saving forms, show error messages for the form as a hole & also show validation messages per input, by the input! 🎯
1. `Shimmer` & `LoadSpin`: Show gentle loading animations with CSS classes! ✨
1. `mongoConnect()` & `mongoModel()`: Manage mongoose data pools & enhance standard mongo typesafety!
1. `cuteLog()` - Create strings w/ 30+ customization options 🎨
1. `holdUp()` - Pause for a specific or random amount of time ⏳
1. `loremWords()` - Generate the number of lorem words you'd love ✍️




## ✨ How may we get started?
- Open a `bash` terminal, & then:
  ```bash
  npx create-solidfun@latest # that was easy 🥳
  ```
- [See what "npx create-solidfun" does automatically 🔮!](https://github.com/chris-carrington/create-solidfun)


## 🧚‍♀️ Got code?!
### GET! 💜
```tsx
import { API } from '@solidfun/api'

export const GET = new API('/api/aloha')
  .fn(async (be) => {
    return be.json({ aloha: true })
  })
```


### Params! 💙
- Required & optional params available @ `routes` & `apis`!
```tsx
import { API } from '@solidfun/api'

export const GET = new API('/api/aloha/:id/:ascend?')
  .params<{ id: number, ascend: boolean }>() // set params type here & then this api's params are known @ .fn() & app-wide 🙌
  .fn(async (be) => {
    const params = be.getParams()
    return be.json({ params })
  })
```


### Middleware! 💚
- Available @ `routes` & `apis`!
```tsx
import { API } from '@solidfun/api'
import { authB4 } from '@src/lib/b4'

export const GET = new API('/api/aloha')
  .b4(authB4) // run this async function b4 this api boots!
  .fn(async (be) => {
    return be.json({ aloha: true })
  })
```


### POST! 🧡
```tsx
import { compare } from 'bcrypt'
import { go } from '@solidfun/go'
import { API } from '@solidfun/api'
import { guestB4 } from '@src/lib/b4'
import { SessionData } from 'fun.config'
import { M_User } from '@src/db/M_User'
import { setSessionData } from '@solidfun/session'
import { mongoConnect } from '@solidfun/mongoConnect'
import { signInSchema, SignInSchema } from '@src/schemas/SignInSchema'


export const POST = new API('/api/sign-in')
  .b4(guestB4)
  .body<SignInSchema>() // tells .fn() & app-wide the request body this api requires
  .fn((be) => {
    const body = signInSchema.parse(await be.getBody()) // get, validate & parse the request body in 1 line!

    await mongoConnect() // ensures 1 mongo pool is running

    const user = await M_User.get().findOne({ email: body.email }).lean()

    if (!user) throw new Error('Please use valid credentials')

    if (!await compare(body.password, user.passwordHash)) throw new Error('Please use valid credentials')

    const sessionData: SessionData = { id: user.id }

    setSessionData(sessionData)

    return be.go('/auhenticated') // go() knows about all your routes & provides autocomplete!
  }
})

```


### Schema 💛
```tsx
import { pipe, email, string, object, nonEmpty } from 'valibot'
import { ValibotSchema, type InferValibotSchema } from '@solidfun/valibotSchema'


export const signInSchema = new ValibotSchema( // schema's validate (be) api's above & (fe) route's below!
  object({
    email: pipe(string(), email('Please provide a valid email')),
    password: pipe(string(), nonEmpty('Please provide a password')),
  })
)

export type SignInSchema = InferValibotSchema<typeof signInSchema> // by defining runtime validations above, we get compile time types app-wide!
```


### Layout! ❤️
```tsx
import './Guest.css'
import GuestNav from './GuestNav'
import { Layout } from '@solidfun/layout'


export default new Layout()
  .component((fe) => {
    return <>
      <div class="guest">
        <GuestNav />
        {fe.getChildren()}
      </div>
    </>
  })
```


### Route! 🌟
```tsx
import { A } from '@solidfun/a'
import { Title } from '@solidjs/meta'
import { Route } from '@solidfun/route'


export default new Route('/yin') // this route uses no layouts!
  .component((fe) => {
    return <>
      <Title>Yin</Title>
      <A path="/yang">Yang</A> {/* <A /> knows about your routes & provides autocomplete! 🙌 */}
    </>
  })
```


### Form! ❤️
  ```tsx
  import { Title } from '@solidjs/meta'
  import { guestB4 } from '@src/lib/b4'
  import RootLayout from '../RootLayout'
  import { clear } from '@solidfun/clear'
  import { Route } from '@solidfun/route'
  import GuestLayout from './Guest.Layout'
  import { Submit } from '@solidfun/submit'
  import { Messages } from '@solidfun/messages'
  import { signUpSchema } from '@src/schemas/SignUpSchema'
  import { createOnSubmit } from '@solidfun/createOnSubmit'


  export default new Route('/sign-up/:sourceId?')
    .b4(guestB4) // run this asyc fn b4 route render
    .layouts([RootLayout, GuestLayout]) // Root wraps Guest, Guest wraps this Route!
    .component((fe) => {
      const onSubmit = createOnSubmit(async (fd) => { // createOnSubmit() places this async fn() into a try/catch for us & on fe or be catch, <Messages /> get populated below!
        const body = signUpSchema.parse({ // get parse & validate request body
          email: fd('email'), // fd() is a form data helper
          password: fd('password')
        }) 

        await fe.POST('/api/sign-up', { body, bitKey: 'signUp' }) // a bit is a boolean signal 💃 & this path & body have autocomplete!
      })

      return <>
        <Title>Sign Up</Title>

        <form onSubmit={onSubmit}>
          <input placeholder="Email" name="email" type="email" use:clear />
          <Messages name="email" /> {/* shows messages, from signUpSchema.parse() and/or fe.POST(), for just the email input! 🚀 */}

          <input placeholder="Password" name="password" type="password" use:clear /> {/* the use:clear directive clears password <Messages /> on first interaction w/ this input! */}
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
