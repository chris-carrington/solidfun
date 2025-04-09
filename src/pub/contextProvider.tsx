import { createStore } from 'solid-js/store'
import type { JSX, Context } from 'solid-js'


export const ContextProvider = ({ children, Context }: { children?: JSX.Element, Context: Context<any> }) => {
  const [store] = createStore(Context.defaultValue)
  
  return <>
    <Context.Provider value={store}>
      {children}
    </Context.Provider>
  </>
}
