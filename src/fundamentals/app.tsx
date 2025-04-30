/**
* 🧚‍♀️ How to access:
*     - import { routes, App, InternalRouterRoot } from '@solidfun/app'
*     - import type { RouterRoot } from '@solidfun/app'
*/
  
  
import { FE } from './fe'
import { Layout } from './layout'
import { Route as FunRoute } from './route'
import { MetaProvider } from '@solidjs/meta'
import { FileRoutes } from '@solidjs/start/router'
import { MessagesCleanup } from '../messagesCleanup'
import { Suspense, useContext, type JSX } from 'solid-js'
import { FEContext, FEContextProvider } from './feContext'
import { Route, Router, useLocation, useParams, type RouteSectionProps } from '@solidjs/router'


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
        <Route component={props => layoutComponent(props, layout1)}>
          <Route path={routes['/a'].path} component={props => routeComponent(props, routes['/a'])} />
          <Route path={routes['/b'].path} component={props => routeComponent(props, routes['/b'])} />
        </Route>
      </Router>
    </>
  }
}
/** gen */



export const InternalRouterRoot: RouterRoot = (props) => {
  const params = useParams()
  const location = useLocation()

  return <>
    <FEContextProvider params={params} location={location}>
      <MetaProvider>
        <Suspense>
          {props.children}
        </Suspense>
      </MetaProvider>
    </FEContextProvider>
  </> 
}



export type RouterRoot = (props: RouteSectionProps) => JSX.Element



export function layoutComponent(props: RouteSectionProps, layout: Layout): JSX.Element {
  return componentWithFE(props, fe => layout.component(fe))
}

export function routeComponent(props: RouteSectionProps, route: FunRoute): JSX.Element {
  return componentWithFE(props, fe => <> <MessagesCleanup /> {route.component?.(fe)}</>)
}


/**
 * - Ensures:
 *     - Layout & route get an fe
 *     - fe is populated w/ proper info
 *     - If somehow we don't have an fe yet we create one
 * @param props Layout or Route props
 * @param component The component we would love to render that we will pass an fe object
 * @returns The component to render that will be ready to useFE()
 */
function componentWithFE<T_Props extends RouteSectionProps>(props: T_Props, component: (fe: FE) => JSX.Element) {
  const fe = useContext(FEContext)

  if (fe) {
    fe.params = props.params
    fe.location = props.location
    fe.children = props.children
    return component(fe)
  }
}
