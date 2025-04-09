import { Suspense } from 'solid-js'
import { Route as FunRoute } from './route'
import { MetaProvider } from '@solidjs/meta'
import { Route, Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'


export const routes = {
  '/a': new FunRoute({ path: '/a', component () { return <></> } }),
  '/b': new FunRoute({ path: '/b', component () { return <></> } }),
}


export const App = () => <>
  <Router root={ (props) => <> <MetaProvider> <Suspense>{props.children}</Suspense> </MetaProvider> </> }>
    <FileRoutes />
    <Route path={routes['/a'].path} component={routes['/a'].component} />
    <Route path={routes['/b'].path} component={routes['/b'].component} />
  </Router>
</>
