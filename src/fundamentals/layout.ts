/**
 * 🧚‍♀️ How to access:
 *     - import { Layout } from '@solidfun/layout'
 */


import type { JSX } from 'solid-js'
import type { RouteComponentArgs } from './app'


export class Layout {
  component: (props: RouteComponentArgs) => JSX.Element


  constructor(options: Options) {
    this.component = options.component
  }
}


type Options = {
  component: (props: RouteComponentArgs) => JSX.Element,
}
