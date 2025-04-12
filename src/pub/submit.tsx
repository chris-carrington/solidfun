/**
 * 🧚‍♀️ How to access:
 *     - import { Submit } from '@solidfun/submit'
 */


import { FE } from './fe'


export const Submit = ({ fe, label, loadKey }: { fe: FE, label: string, loadKey: string }) => {
  const [isLoading] = fe.getLoading(loadKey)
  return <button class="btn" type="submit" disabled={ isLoading() }>{ isLoading() ? <span class="load"></span> : label }</button>
}
