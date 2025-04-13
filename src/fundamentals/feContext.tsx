/**
 * 🧚‍♀️ How to access:
 *     - import { FE_Context } from '@solidfun/feContext'
 */


import { FE } from './fe'
import { createContext, type JSX } from 'solid-js'
import { ContextProvider } from './contextProvider'


export const FE_Context = createContext(new FE())


export const FE_ContextProvider = ({children}: {children?: JSX.Element}) => <ContextProvider Context={FE_Context}>{children}</ContextProvider>
