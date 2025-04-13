/**
 * 🧚‍♀️ How to access:
 *     - import { DateTimeFormat } from '@solidfun/dateTimeFormat'
 */


/**
 * - `Intl.DateTimeFormatOptions` componenet
 * - Example:
 *     - `<DateTimeFormat date={createdAt} options={{ year: 'numeric', month: '2-digit', day: '2-digit' }} />`
 * @param date - `(new Date).toISOString()`
 * @param options `Intl.DateTimeFormatOptions`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param falsyValue What to show if date is falsy, default is `-`
 * @returns An elementless string component, that's only item is a formatted date, based on timezones & your passed in options
 */
export function DateTimeFormat({ date, options, falsyValue: defaultValue }: { date: any, options: Intl.DateTimeFormatOptions, falsyValue?: string }) {
  return <>{ typeof date === 'string' ? (new Date(date)).toLocaleDateString(undefined, options): defaultValue || '-' }</>
}
