/**
 * 🧚‍♀️ How to access:
 *     - import { Submit } from '@solidfun/submit'
 */


import { FE } from './fe'


export const Submit = ({ fe, label, loadKey }: { fe: FE, label: string, loadKey: string }) => {
  return <button class="btn" type="submit" disabled={ fe.isLoading(loadKey) }>
    {
      fe.isLoading(loadKey)
        ? <span class="load"></span>
        : label 
    }
  </button>
}
