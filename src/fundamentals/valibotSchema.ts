/**
 * 🧚‍♀️ How to access:
 *     - import { ValibotSchema } from '@solidfun/valibot'
 *     - import type { InferValibotSchema } from '@solidfun/valibot'
 */


import { flatten, safeParse, type BaseSchema, type InferOutput } from 'valibot'


/** `Valibot` parses & validates data and `ValibotSchema` standardizes parsing w/ `this.parse()` & type inference w/ `InferValibotSchema`  */
export class ValibotSchema<T extends BaseSchema<any, any, any>> {
  schema: T;

  constructor(schema: T) {
    this.schema = schema;
  }

  /**
   * 1. Validbot safe parse an entire input
   * - On Success: Return parsed
   * - On Fail: Throw flattened errors
   * @param input - Input to parse
   * @param schema - Schema the input should look like
   * @returns - Parsed output or throws an error if any issues
   */
  parse(input: AnyValue<InferOutput<T>>): InferOutput<T> {
    const result = safeParse(this.schema, input)

    if (result.issues) throw flatten(result.issues)

    return result.output
  }
}


/**
 * - Takes a fun ValibotSchema and infers the type of that schema
 * - IF "T" is a ValibotSchema THEN Set "S" to "T" and then respond with v.InferOutput<S>
 */
export type InferValibotSchema<T> = T extends ValibotSchema<infer S> ? InferOutput<S> : never


/**
 * Goal w/ 3 types below: Enforce the exact shape of keys from InferOutput<T> @ `parse()`
 * Allow more flexible values (e.g., string | null instead of just string) b/c `fd()` has no guarantee's on response but valibot will guarantee that but atleast the object shape going into parse can be enforced, let valibot do the actual value enforcing
 * Disallow extra keys not in the inferred shape.
 */


/**
 * - What:
 *     - Loop through each key in T
 *     - Assign the type `unknown` to each key
 * - Why:
 *     - Remember the goal above, correct keys, any (unknown) value
 * - So:
 *     - IF T is { aloha: boolean } THEN AllowAnyValue<T> is { aloha: unknown }
 */
type AllowAnyValue<T> = { [K in keyof T]: unknown }


/**
 * - Exclude<keyof U, keyof T>
 *     - Ensures U has no extra keys in it
 *     - Puts U keys into array and then removes keys also in T
 *     - So if U has any extra keys we don't match exact keys amongst objects
 * - If `Exclude<keyof T, keyof U>` is truthy we don't have exact keys which will throw a ts errow with the extends `never` and if we do we'll return U aka the object keys
 */
type ExactKeys<T, U> = Exclude<keyof U, keyof T> extends never
  ? Exclude<keyof T, keyof U> extends never
    ? U
    : never
  : never;


/**
 * - From the shape T
 * - Replace its values w/ unknown
 * - Enforce that the keys are exactly that of T
 */
type AnyValue<T> = ExactKeys<T, AllowAnyValue<T>>
