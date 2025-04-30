/**
 * 🧚‍♀️ How to access:
 *     - import { Layout } from '@solidfun/layout'
 *     - import type { LayoutOptions } from '@solidfun/layout'
 */


import type { Component } from './types'


export class Layout {
  component: Component


  constructor(options: LayoutOptions) {
    this.component = options.component
  }
}


export type LayoutOptions = {
  component: Component,
}
