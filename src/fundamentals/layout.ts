/**
 * 🧚‍♀️ How to access:
 *     - import { Layout } from '@solidfun/layout'
 *     - import type { LayoutOptions } from '@solidfun/layout'
 */


import type { LayoutComponent } from './types'



export class Layout {
  public readonly values: LayoutValues = {}

  component(fn: LayoutComponent): this {
    this.values.component = fn
    return this
  }
}


type LayoutValues = {
  component?: LayoutComponent
}