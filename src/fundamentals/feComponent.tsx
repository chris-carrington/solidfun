/**
 * 🧚‍♀️ How to access:
 *     - import { feComponent } from '@solidfun/feComponent'
 */


import { type JSX } from 'solid-js'
import { clientOnly } from '@solidjs/start'


/**
 * ### Creates a frontend (fe) only component!
 * 
 * @example
 * 
  ```ts
  import { onCleanup, onMount } from 'solid-js'
  import { feComponent } from '@solidfun/feComponent'


  export default feComponent((props: { name: string }) => {
    onMount(() => {
      document.addEventListener('click', onClick)
    })

    onCleanup(() => {
      document.removeEventListener('click', onClick)
    })

    function onClick(event: MouseEvent) {
      console.log('aloha')
    }

    const fe = useFE()

    return <div>Hi, {props.name}!</div>
  })
  ```
 * 
 */
export function feComponent<T_Props extends Record<string, any> = {}>(Component: (props: T_Props) => JSX.Element): (props: T_Props) => JSX.Element {
  return clientOnly(async () => ({ // mimic default export: clientOnly(() => import('./SomeComponent'))
    default: (props: T_Props) => <Component {...props} />
  }))
}
