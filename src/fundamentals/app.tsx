/**
* 🧚‍♀️ How to access:
*     - import { routes, App, InternalRouterRoot } from '@solidfun/app'
*     - import type { RouterRoot } from '@solidfun/app'
*/
  
  
import { Layout } from './layout'
import { Route as FunRoute } from './route'
import { MetaProvider } from '@solidjs/meta'
import { FileRoutes } from '@solidjs/start/router'
import { MessagesCleanup } from '../messagesCleanup'
import type { RouteProps, LayoutProps } from './types'
import { useContext, Suspense, type JSX } from 'solid-js'
import { FE_Context, FE_ContextProvider } from './feContext'
import { Route, Router, type RouteSectionProps } from '@solidjs/router'


/** gen */
const layout1 = new Layout({ component() { return <></> } })

export const routes = {
  '/a': new FunRoute({ layouts: [layout1], path: '/a', component () { return <></> } }),
  '/b': new FunRoute({ layouts: [layout1], path: '/b', component () { return <></> } }),
}

/** 
 * - Returns a function that when called provided an <App /> component
 */
export function createApp(Root = InternalRouterRoot) {
  return function () {
    return <>
      <Router root={Root}>
        <FileRoutes />
        <Route component={props => lc(props, layout1)}>
          <Route path={routes['/a'].path} component={props => rc(props, routes['/a'])} />
          <Route path={routes['/b'].path} component={props => rc(props, routes['/b'])} />
        </Route>
      </Router>
    </>
  }
}
/** gen */



export const InternalRouterRoot: RouterRoot = (props) => <>
  <FE_ContextProvider>
    <MetaProvider>
      <Suspense>
        {props.children}
      </Suspense>
    </MetaProvider>
  </FE_ContextProvider>
</> 



export type RouterRoot = (props: RouteSectionProps) => JSX.Element



/**
 * RC stands for Route Component
 * This gives each route render a FE object
 * @param props - The standard props that a component recieves when it is navigated to
 * @param component The component to render which is a function that returns jsx
 * @returns The response of the call to `route.component(_props)` or undefined if no route defined
 */
function rc(props: RouteSectionProps, route: FunRoute) {
  let res = undefined

  if (route instanceof FunRoute && route.component) {
    const fe = useContext(FE_Context)
    const _props: RouteProps = { fe, location: props.location, data: props.data, params: props.params } // route don't have children including is confusing
    res = route.component(_props)
  }

  return <>
    <MessagesCleanup />
    {res}
  </>
}



/**
 * RC stands for Layout Component
 * `lc()` gets called first on each layout render and then calls the current layouts `component()` function
 * @param props - The standard props that a layout component recieves when it is navigated to
 * @param component The component to render which is a function that returns jsx
 * @returns The response of the call to `layout.component(_props)` or undefined if no route defined
 */
function lc(props: RouteSectionProps, layout: Layout) {
  let res = undefined

  if (layout instanceof Layout) {
    const fe = useContext(FE_Context)
    const _props: LayoutProps = { fe, location: props.location, data: props.data, params: props.params, children: props.children }
    res = layout.component(_props)
  }

  return res
}
