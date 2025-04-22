/**
 * 🧚‍♀️ How to access:
 *     - import { ParamEnums } from '@solidfun/paramEnums'
 *     - import type { InferEnums } from '@solidfun/paramEnums'
 */


/**
 * - Helpful when you've got a param that can be a set of different string values (enums)
 */
export class ParamEnums<const T_Enums extends readonly string[]> {
  readonly enums: T_Enums
  #set: Set<string>

  constructor(...enums: T_Enums) {
    this.enums = enums
    this.#set = new Set(enums)
  }


  /**
   * Determines if the potential enum recieved by `has()` is a valid enum according to the current `this.#set`
   * @param potentialEnum The value we are wondering is an enum
   * @returns Boolean, Is the potential enum valid or not
   */
  has(potentialEnum: unknown): potentialEnum is T_Enums[number] {
    return typeof potentialEnum === 'string' && this.#set.has(potentialEnum)
  }


  /**
   * The enums as a string joined together
   * @param joinedBy How the enums are joined, defaults to " | "
   */
  toString(joinedBy = ' | '): string {
    return this.enums.join(joinedBy)
  }
}


/**
 * - Example: `export type Category = InferEnums<typeof categorySet>`
 * - Receives a `paramEnums` object
 * - Gives back the type that one value may be, example: 'fire' | 'water'
 */
export type InferEnums<T_ParamEnums extends ParamEnums<readonly string[]>> = T_ParamEnums extends ParamEnums<infer T_Values>
  ? T_Values[number]
  : never
