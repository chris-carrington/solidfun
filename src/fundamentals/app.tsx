/**
* 🧚‍♀️ How to access:
*     - import { routes, App, InternalRouterRoot } from '@solidfun/app'
*     - import type { RouterRoot } from '@solidfun/app'
*/
  
  
import { Layout } from './layout'
import { Route as FunRoute } from './route'
import { MetaProvider } from '@solidjs/meta'
import { Suspense, type JSX } from 'solid-js'
import { FileRoutes } from '@solidjs/start/router'
import { MessagesCleanup } from '../messagesCleanup'
import { getFE, FEContextProvider, _setChildren } from './fe'
import { Route, Router, type RouteSectionProps } from '@solidjs/router'



/** gen */
const layout1 = new Layout()
  .component(() => <></>)

const routeA = new FunRoute('/a')
  .component(() => <></>)
  .layouts([layout1])

const routeB = new FunRoute('/b')
  .component(() => <></>)
  .layouts([layout1])

const routeC = new FunRoute('/c')
  .params<{ id: string }>()
  .layouts([layout1])
  .component(fe => {
    const params = fe.getParams()
    return <></>
  })

export const routes = {
  '/a': routeA,
  '/b': routeB,
}

export function createApp(Root = InternalRouterRoot) {
  return function () {
    return <>
      <Router root={Root}>
        <FileRoutes />
        <Route component={props => layoutComponent(props, layout1)}>
          <Route path={routes['/a'].values.path} component={() => routeComponent(routes['/a'])} />
          <Route path={routes['/b'].values.path} component={() => routeComponent(routes['/b'])} />
        </Route>
      </Router>
    </>
  }
}
/** gen */



export const InternalRouterRoot: RouterRoot = (props) => {
  return <>
    <FEContextProvider>
      <MetaProvider>
        <Suspense>
          {props.children}
        </Suspense>
      </MetaProvider>
    </FEContextProvider>
  </> 
}



export type RouterRoot = (props: RouteSectionProps) => JSX.Element



export function routeComponent(route: FunRoute): JSX.Element | undefined {
  const fe = getFE()

  const res = route.values.component?.(fe)

  return !res ? undefined : <>
    {res}
    <MessagesCleanup />
  </>
}



export function layoutComponent(props: RouteSectionProps, layout: Layout): JSX.Element {
  const fe = getFE()
  _setChildren(fe, props.children)
  return layout.values.component?.(fe)
}
