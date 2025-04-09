/**
 * 🧚‍♀️ How to access:
 *     - import { Layout } from '@solidfun/layout'
 */


import type { JSX } from 'solid-js'
import type { RouteSectionProps } from '@solidjs/router'


export class Layout {
  /** If no path specified => this layout groups pages w/o url alteration */
  path?: string
  name?: string
  component: (props: RouteSectionProps) => JSX.Element


  constructor(options: Options) {
    this.path = options.path
    this.name = options.name
    this.component = options.component
  }
}


type Options = {
  /** If no path specified => this layout groups pages w/o url alteration */
  path?: string
  name?: string
  component: (props: RouteSectionProps) => JSX.Element,
}
