/**
 * 🧚‍♀️ How to access:
 *     - import { Layout } from '@solidfun/layout'
 *     - import type { LayoutOptions } from '@solidfun/layout'
 */


import type { JSX } from 'solid-js'
import type { LayoutProps } from './types'


export class Layout {
  component: (props: LayoutProps) => JSX.Element


  constructor(options: LayoutOptions) {
    this.component = options.component
  }
}


export type LayoutOptions = {
  component: (props: LayoutProps) => JSX.Element,
}
