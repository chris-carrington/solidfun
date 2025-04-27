import { onCleanup, useContext } from 'solid-js'
import { FE_Context } from './fundamentals/feContext'
import { feComponent } from './fundamentals/feComponent'


/**
 * - Ensures that messages don't carry over from page to page
 */
export const MessagesCleanup = feComponent(() => {
  const fe = useContext(FE_Context)
  
  onCleanup(() => {
    fe.messages.clearAll()
  })

  return <></>
})
