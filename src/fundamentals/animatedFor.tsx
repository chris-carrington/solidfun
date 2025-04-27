/**
 * 🧚‍♀️ How to access:
 *     - import { AnimatedFor, ForAnimator } from '@solidfun/animatedFor'
 */


import { onMount, type JSX } from 'solid-js'


/**
 * - Helpful when you'd love to add items to the top of a For component smoothly
 * 
 * ---
 * 
 * @example
 * ```css
    .items {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .item {
      opacity: 0;
      transform: translateY(-20px);
      transition: var(--speed);
      clip-path: polygon(52% 42%, 55% 42%, 54% 43%, 54% 44%);
      &.in {
        opacity: 1;
        transform: translateY(0);
        clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 0);
      }
    }
 * ```
 * 
 * ---
 * 
 * @example
 * ```tsx
import './Example.css'
import '@solidfun/loadSpin.styles.css'
import { Route } from '@solidfun/route'
import { createSignal, For, Show } from 'solid-js'
import { AnimatedFor, ForAnimator } from '@solidfun/animatedFor'


export default new Route({
  path: '/fortune',
  component({ fe }) {
    const forAnimator = new ForAnimator()
    const [items, setItems] = createSignal<string[]>([])

    async function onClick() {
      forAnimator.preFetch()

      const res = await fe.GET('/api/example', { bitKey: 'example'})

      if (res.data) {
        setItems([ res.data.items, ...items() ]) // bind dom
        forAnimator.postSet()
      }
    }

    return <>
      <button onClick={onClick}>
        <Show when={fe.bits.isOn('example')} fallback="Click for Side In!">
          <span class="load-spin--two"></span>
        </Show>
      </button>

      <ForAnimated class="items" forAnimator={ forAnimator } items={
        <For each={items()}>
          {item => <div class="item">{item}</div>}
        </For>
      } />
    </>
  }
})
 * ```
 * 
 *  * 
 * @param options.items - SolidJS For Component 
 * @param options.forAnimator - Helper object to keep track of element positions
 * @param ...props - Go on the wrapper div element
 */
export function AnimatedFor({ items, forAnimator, ...props }: { items: JSX.Element, forAnimator: ForAnimator } & JSX.HTMLAttributes<HTMLDivElement>) {
  let domElementsWrapper: HTMLDivElement

  onMount(() => {
    if (domElementsWrapper) forAnimator.domElementsWrapper = domElementsWrapper
  })

  return <>
    <div ref={el => (domElementsWrapper = el)} {...props}>
      {items}
    </div>
  </>
}


/**
 * - Keeps track of original item positions before we get new data
 * - So then when we animate later, we can start from the original positions
 */
export class ForAnimator {
  ogPositions: DOMRect[] | undefined
  domElementsWrapper: HTMLDivElement | undefined


  /**
   * - Call this before the fetch for more data is made
   * - Get's the original positions, so then when we animate later, we can start from the original positions
   */
  preFetch(): void {
    if (this.domElementsWrapper) {
      const ogElements = Array.from(this.domElementsWrapper.children) as HTMLElement[]
      this.ogPositions = ogElements.map(el => el.getBoundingClientRect())
    }
  }

  /**
   * - Called after the success fetch & the DOM set
   * - Does the animations
   * @param options.animateInClass - Defaults to "in" - The class to place on the newest item coming in
   * @param options.animateInClass - Defaults to "var(--speed)" - The `el.style.transition` to place on each child item at the end
   */
  postSet(options: { animateInClass?: string; transitionEndValue?: string; } = {}): void {
    requestAnimationFrame(() => { // next tick
      if (this.ogPositions && this.domElementsWrapper) {
        const { animateInClass = 'in', transitionEndValue = 'var(--speed)' } = options // options defaults

        const newItems = Array.from(this.domElementsWrapper.children) as HTMLElement[]
    
        newItems.forEach((el, i) => {
          if (i === 0) { // newest item
            requestAnimationFrame(() => {
              el.classList.add(animateInClass) // animate in
            })
          } else if (this.ogPositions) { // existing items
            const ogPosition = this.ogPositions[i - 1]

            if (ogPosition) {
              const newPosition = el.getBoundingClientRect()
              const topDifference = ogPosition.top - newPosition.top
      
              if (topDifference) {
                el.style.transition = 'all 0s' // immediately go
                el.style.transform = `translateY(${topDifference}px)` // to the previous position
      
                requestAnimationFrame(() => { // on next tick
                  el.style.transition = transitionEndValue // smoothly move back
                  el.style.transform = 'translateY(0)' // to the newest position
                })
              }
            }
          }
        })
      }
    })
  }
}
