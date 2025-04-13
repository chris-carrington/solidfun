/**
 * 🧚‍♀️ How to access:
 *     - import { Messages } from '@solidfun/messages'
 */


import { FE } from './fe'
import { For, Show } from 'solid-js'
import { DEFAULT_MESSAGE_NAME } from './vars'



/**
 * Messages are arrays of strings: string[]
 * Messages are grouped by name: Record<string, string[]>
 * On the fe each group of messages is a Signal: Signal<string[]>
 * This component will show the messages for one group
 * options.css - To give a class name to the wrapper
 * options.name - Messages are grouped by name
 */
export const Messages = ({ fe, name = DEFAULT_MESSAGE_NAME, css }: { fe: FE, type?: string, name?: string, css?: string }) => {
  const [messages] = fe.messages.get(name)

  return <>
    <Show when={ messages()?.length }>
      <div class={ 'fun_messages ' + css }>
        <Show when={ messages().length > 1 } fallback={messages()[0]}>
          <ul>
            <For each={messages()}>{ (msg) => <li>{msg}</li> }</For>
          </ul>
        </Show>
        <button class="close" type="button" onClick={ () => fe.messages.clear(name) }>x</button>
      </div>
    </Show>
  </>
}
