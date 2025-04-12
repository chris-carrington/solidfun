/**
 * 🧚‍♀️ How to access:
 *     - import { routes, App } from '@solidfun/app'
 */



import { FE } from './fe'
import { Route as FunRoute } from './route'
import { MetaProvider } from '@solidjs/meta'
import { useContext, Suspense } from 'solid-js'
import { FileRoutes } from '@solidjs/start/router'
import { FE_Context, FE_ContextProvider } from './feContext'
import { Route, Router, type RouteSectionProps } from '@solidjs/router'


export const routes = {
  '/a': new FunRoute({ path: '/a', component () { return <></> } }),
  '/b': new FunRoute({ path: '/b', component () { return <></> } }),
}


export const App = () => <>
  <Router root={Root}>
    <FileRoutes />
    <Route path={routes['/a'].path} component={props => rc(props, routes['/a'])} />
    <Route path={routes['/b'].path} component={props => rc(props, routes['/b'])} />
  </Router>
</>


function rc(props: RouteSectionProps, route: FunRoute) {
  const fe = useContext(FE_Context)
  const args: RouteComponentArgs = { fe, ...props }

  return route.component ? route.component(args) : undefined
}

export type RouteComponentArgs = RouteSectionProps & { fe: FE }

function Root (props: RouteSectionProps) {
  return <>
    <FE_ContextProvider>
      <MetaProvider>
        <Suspense>{props.children}</Suspense>
      </MetaProvider>
    </FE_ContextProvider>
  </> 
}
