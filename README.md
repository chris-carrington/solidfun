![Sloths developing software in a tree](https://i.imgur.com/LognTyf.jpeg)

## 🤓 `Solid Fun` Features!
1. [Free](#-how-to-deploy) global hosting, 💸 thanks to [Cloudflare](https://www.cloudflare.com/)! ☁️
1. Smooth `SPA` navigation! 🧚‍♀️ 
1. Define 0 to many `layouts` for `routes` to be placed within! 📥 
1. Enjoy fast first paints, b/c all static content is in the initial HTML! 😊
1. Make multiple api calls during a page reder, have static content available immediately and stream dynamic items w/ no layout shifts, the moment each dynamic item resolves, as seen @ `npx create-solidfun@latest` ✅
1. Directly ***within your editor***, enjoy app specific `autocomplete` ❤️, when:
    - Creating **links**
    - Making **API** calls
    - Setting up **redirects**
1. Smaller than a photo 📸 b/c even when **unminified** `Solid Fun` is less then **`150 kB`**, requires **`0 dependencies`** & features an automatically tree shaked API! 🙌
1. On ***update***... Only ***update***... What ***updated***  💪 thanks to [Solid](https://www.solidjs.com/)! 🙏
1. Easilly `define`, `read` and `validate`, **path or search** `params`, at **api's or route's**! 🪷
1. When saving forms, show validation messages per input — and clear previous messages on interaction! 🎯
1. Honorable mentions include:
    - `cuteLog()` - Create strings w/ 30+ customization options 🎨
    - `holdUp()` - Pause for a specific or random amount of time ⏳
    - `loremWords()` - Generate the number of lorem words you'd love ✍️
1. Like middleware, run `async` functions **before** your `route`'s or `api`'s boot! 🔐
1. Simplifies cookies, session & auth, thanks to the `set`, `get` & `clear`, session data helpers! 🚨 
1. Animate your lists beautifully, with the `<AnimatedFor />` component! 🌀
1. Connect to MongoDB with connection pools and enjoy enhanced types for your models! 🍃
1. Show gentle loading animations with the included `shimmer` and `loadSpin` CSS classes! ✨
1. Features rich `examples` & `docs` directly **in your editor** --  when hovering over `Solid Fun` **types, functions and components**! 📝 & Helps us get code clean, 🧼 b/c `Solid Fun` throws ❌ when **routes or api's** change but **path's, body's or param's**, *app wide* have not... yet!
1. Create new projects 👩‍🍼 and build the **`autocompleting intellisense types`** for existing ones 🏗️ wih our `blazingly-fast cli` ⚡️!
  


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


  export const GET = new API({
    path: '/api/aloha',
    async fn() {
      return { aloha: true}
    }
  })
  ```


### POST! 💙 
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


export const POST = new API({
  b4: guestB4, // run this async function b4 this route boots!
  path: '/api/sign-in',
  async fn({ event }) { // placed w/in a try/catch for us!
    const body = signInSchema.parse(await event.request.json()) // get, validate & parse the request body in 1 line!

    await mongoConnect() // ensures 1 mongo pool is running

    const user = await M_User.get().findOne({ email: body.email }).lean()

    if (!user) throw new Error('Please use valid credentials')

    if (!await compare(body.password, user.passwordHash)) throw new Error('Please use valid credentials')

    const sessionData: SessionData = { id: user.id }

    setSessionData(sessionData)

    return go('/auhenticated') // intellisense!
  }
})
.body<SignInSchema>() // tells app body type for this api, so now fe.POST() will have autocomplete!
```


### Schema 💚
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


### Layout! 💛
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


### Route! 🧡
```tsx
import { A } from '@solidfun/a'
import { Title } from '@solidjs/meta'
import { Route } from '@solidfun/route'


export default new Route({ // this route uses no layouts!
  path: '/yin',
  component({ fe }) {
    return <>
      <Title>Yin</Title>
      <A path="/yang">Yang</A> {/* intellisense! 🙌 */}
    </>
  }
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


  export default new Route({
    b4: guestB4, // run this asyc fn b4 route render
    path: '/sign-up/:sourceId?' // options path params! multi is available too!
    layouts: [RootLayout, GuestLayout], // root wraps guest, gues wraps this route!
    component({ fe }) {
      const onSubmit = createOnSubmit(async (fd) => { // fd() is a form data helper, createOnSubmit() places this async fn() into a try/catch for us & on fe or be catch, <Messages /> get populated below!
        const body = signUpSchema.parse({ 
          email: fd('email'),
          password: fd('password')
        }) 

        await fe.POST('/api/sign-up', { body, bitKey: 'signUp' }) // a bit is a boolean signal 💃 & this path & body have intellisense!
      })

      return <>
        <Title>Sign Up</Title>

        <form onSubmit={onSubmit}>
          <input placeholder="Email" name="email" type="email" use:clear />
          <Messages name="email" /> {/* shows messages, from signUpSchema.parse() and/or fe.POST(), for just the email input! 🚀 */}

          <input placeholder="Password" name="password" type="password" use:clear /> {/* the use:clear directive here clears password <Messages /> on first interaction w/ this input! */}
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
