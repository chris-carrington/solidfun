/**
* 🧚‍♀️ How to access:
*     - import { routes, App, InternalRouterRoot } from '@solidfun/app'
*     - import type { RouteComponentArgs, RouterRoot } from '@solidfun/app'
*/
  
  
import { FE } from './fe'
import type { Layout } from './layout'
import { Route as FunRoute } from './route'
import { MetaProvider } from '@solidjs/meta'
import { FileRoutes } from '@solidjs/start/router'
import { FE_Context, FE_ContextProvider } from './feContext'
import { Route, Router, type RouteSectionProps } from '@solidjs/router'
import { useContext, Suspense, ErrorBoundary, type JSX } from 'solid-js'


/** gen */
export const routes = {
  '/a': new FunRoute({ path: '/a', component () { return <></> } }),
  '/b': new FunRoute({ path: '/b', component () { return <></> } }),
}


export const App = ({ root }: { root?: RouterRoot }) => <>
  <Router root={root || InternalRouterRoot }>
    <FileRoutes />
    <Route path={routes['/a'].path} component={props => rc(props, routes['/a'])} />
    <Route path={routes['/b'].path} component={props => rc(props, routes['/b'])} />
  </Router>
</>
/** gen */


export type RouterRoot = (props: RouteSectionProps) => JSX.Element


export const InternalRouterRoot: RouterRoot = (props: RouteSectionProps) => {
  return <>
    <ErrorBoundary fallback={errorBoundaryFallback}>
      <FE_ContextProvider>
        <MetaProvider>
          <Suspense>
            {props.children}
          </Suspense>
        </MetaProvider>
      </FE_ContextProvider>
    </ErrorBoundary>
  </> 
}


/**
 * RC stands for Route Component
 * This gives each route render a FE object
 * @param props - The standard props that a component recieves when it is navigated to
 * @param component The component to render which is a function that return jsx
 * @returns The response of the call to `route.component(args)` or undefined if no route defined
 */
function rc(props: RouteSectionProps, route: FunRoute | Layout) {
  const fe = useContext(FE_Context)
  const args: RouteComponentArgs = { fe, ...props }

  if (route instanceof FunRoute) fe.messages.clearAll() // on route boot fresh messages

  return route?.component ? route.component(args) : undefined
}


/**
 * - The args that get passed to a `route` or `layout` during render include:
 *     - `fe`
 *     - `params`
 *     - `location`
 *     - `data`: `T`
 *     - `children`
 */
export type RouteComponentArgs<T = unknown> = RouteSectionProps<T> & { fe: FE }


function errorBoundaryFallback(error: any, reset: () => void) {
  return <>
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  </>
} 