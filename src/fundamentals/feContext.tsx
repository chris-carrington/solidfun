/**
 * 🧚‍♀️ How to access:
 *     - import { FEContext } from '@solidfun/feContext'
 */


import { FE } from './fe'
import { createContext, type JSX } from 'solid-js'
import type { Params, Location } from '@solidjs/router'


export const FEContext = createContext<FE>()


export function FEContextProvider({ params, location, children }: { params: Params, location: Location, children?: JSX.Element }) {
  return <>
    <FEContext.Provider value={new FE(params, location, children)}>
      {children}
    </FEContext.Provider>
  </>
}
