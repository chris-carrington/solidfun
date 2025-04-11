/**
 * 🧚‍♀️ How to access:
 *     - import { Submit } from '@solidfun/submit'
 */


import { FE } from './fe'


export const Submit = ({ fe, label }: { fe: FE, label: string }) => {
  const [isLoading] = fe.getLoading()
  return <button class="btn" type="submit" disabled={ isLoading() }>{ isLoading() ? <span class="load"></span> : label }</button>
}
