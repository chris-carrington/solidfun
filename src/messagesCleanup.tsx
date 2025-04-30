import { onCleanup } from 'solid-js'
import { useFE } from './fundamentals/fe'
import { feComponent } from './fundamentals/feComponent'


/**
 * - Ensures that messages don't carry over from page to page
 */
export const MessagesCleanup = feComponent(() => {
  const fe = useFE()

  onCleanup(() => {
    fe.messages.clearAll()
  })

  return <></>
})
