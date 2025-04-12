/**
 * 🧚‍♀️ How to access:
 *     - import { Layout } from '@solidfun/layout'
 */


import type { JSX } from 'solid-js'
import type { RouteComponentArgs } from './app'


export class Layout {
  /** If no path specified => this layout groups pages w/o url alteration */
  path?: string
  moduleName?: string
  component: (props: RouteComponentArgs) => JSX.Element


  constructor(options: Options) {
    this.path = options.path
    this.moduleName = options.moduleName
    this.component = options.component
  }
}


type Options = {
  /** If no path specified => this layout groups pages w/o url alteration */
  path?: string
  moduleName?: string
  component: (props: RouteComponentArgs) => JSX.Element,
}
