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
  parse(input: InferOutput<T>): InferOutput<T> {
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
