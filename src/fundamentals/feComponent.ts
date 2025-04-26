/**
 * 🧚‍♀️ How to access:
 *     - import { feComponent } from '@solidfun/feComponent'
 *     - import type { FEComponent } from '@solidfun/feComponent'
 */


import { type JSX } from 'solid-js'
import { clientOnly } from '@solidjs/start'


/**
 * ### Creates a frontend (fe) only component!
 * 
 * **Event Listener Example:**
 * ```ts
 * import { onMount, onCleanup } from 'solid-js'
 * import { feComponent } from '@solidfun/feComponent'
 * 
 * export const ListenerExample = feComponent(() => {
 *   onMount(() => {
 *     document.addEventListener('click', onClick)
 *   })
 * 
 *   onCleanup(() => {
 *     document.removeEventListener('click', onClick)
 *   })
 * 
 *   function onClick(event: MouseEvent) {
 *     console.log('event', event)
 *   }
 * 
 *   return <></> // tsx 🧚‍♀️
 * })
 * ```
 * 
 * ---
 * 
 * **Component Props Example:**
 * ```ts
 * import { type JSX } from 'solid-js'
 * 
 * export const PropsExample = feComponent(({ name }: { name: string }) => {
 *   return <div>❤️ {name}</div>
 * })
 * ```
 * 
 * ---
 * 
 * **Use Example:**
 * ```tsx
 * import { Layout } from '@solidfun/layout' // or route 🥳
 * import PropsExample from '@src/lib/PropsExample'
 * import ListenerExample from '@src/lib/ListenerExample'
 * 
 * export default new Layout({
 *   component({ children }) {
 *     return <>
 *       <ListenerExample />
 *       <PropsExample name="Solid Fun!" />
 *       {children}
 *     </>
 * ```
 * ---
 * @param component An anonymous function of type `FEComponent`
 * @returns A fe only component!
 */
export function feComponent<T_Props = {}>(component: FEComponent<T_Props>): FEComponent<T_Props> {
  return clientOnly(() => Promise.resolve({ default: component })) as FEComponent<T_Props>
}


/**
 * The anonymous function we pass to `feComponent()`
 * @param props Treat like standard component props we'd destructure for any Solid component
 * 
 * ---
 * ### Complex Example:
 * ```ts
 * import { type JSX } from 'solid-js'
 * 
 * export const Example = feComponent(({ name, ...props }: { name: string } & JSX.HTMLAttributes<HTMLDivElement>) => {
 *   return <div {...props}>❤️ {name}</div>
 * })
 * ```
 */
export type FEComponent<T_Props = {}> = (props: T_Props) => JSX.Element
