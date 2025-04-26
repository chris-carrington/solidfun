import { fileURLToPath } from 'node:url'
import type { FunConfig } from 'solidfun'
import { buildRead } from './buildRead.js'
import { buildWrite } from './buildWrite.js'
import { fundamentals } from '../../fundamentals.js'
import path, { join, resolve, dirname } from 'node:path'
import { supportedApiMethods } from '../../fundamentals/vars.js'



/**
 * - Builds types, components and functions
 * - Configured w/ `fun.config.js`
 * - Command Options:
 *     - `--verbose`: Log what's happening
 * @param cwd Common working directory
 */
export async function cliBuild(cwd: string) {
  const build = await Build.Create(cwd)
  await build.doBuild()
}



export class Build {
  cwd: string
  env: string
  space = '\n'
  baseUrl: string
  fsApp?: string
  config: FunConfig
  dirRead: string
  fsSolidTypes?: string
  dirWriteRoot: string
  dirWriteFundamentals: string
  noLayoutRoutes: Route[] = [] 
  whiteList: FundamentalWhiteList = new FundamentalWhiteList()
  apiCounts: { GET: number, POST: number } = { GET: 0, POST: 0 }
  commandOptions = new Set(process.argv.filter(arg => arg.startsWith('--')))
  writes: Writes = { types: '', imports: '', pipeGET: '', pipePOST: '', constGET: '', constPOST: '', pipeRoutes: '' }
  counts: { GET: number, POST: number, routes: number, layouts: number } = { GET: 0, POST: 0, routes: 0, layouts: 0 }

  /**
   * - We start off with a single root node
   * - Root Node: Virtual, top‑level container that always exists
   * - Each time we discover a Route @ `bindAppData()` we insert it into this tree
   * - If the route has no layouts => it goes into root.routes
   */
  tree: TreeNode = { moduleName: 'root', routes: [], layouts: new Map() }


  /**
   * - What `Create()` does: 
   *     - Get the environment (`env`) in the command: if the command is `fun build local` the `env` is `local`
   *     - Get the `config` defined @ `fun.config.js`
   *     - Get the `baseUrl` by aligning the `config` w/ the `env`
   *     - Populate the white list of fundamentals that must be included in the build
   *     - Populate lots of additional helpful variables
   * @param cwd - Common working directory
   * @returns An jarvis object
   */
  static async Create(cwd: string) {
    const env = Build.#getEnv()
    const {config, configPath} = await Build.#getConfig(cwd)
    const baseUrl = Build.#getBaseUrl(env, config)

    /** 
     * - Why get these values (`env`, `baseUrl`, `config`, `configPath`) before creating an jarvis object? 
     * - Better downstream types, example: this way, `jarvis.env` is of type `string`, not type `string` | `undefined`
     */
    const build = new Build(cwd, env, baseUrl, config, configPath)

    return build
  }


  async doBuild() {
    await buildRead(this)
    await buildWrite(this)
    this.#goodByeLog()
  }


  #goodByeLog() {
    if (!this.commandOptions.has('verbose')) console.log(`✅ Wrote: .solidfun`)
  }


  private constructor(cwd: string, env: string, baseUrl: string, config: FunConfig, configPath: string) {
    this.cwd = cwd
    this.env = env
    this.baseUrl = baseUrl
    this.config = this.whiteList.populate(config)

    this.dirWriteRoot = join(cwd, '.solidfun')
    this.dirWriteFundamentals = join(cwd, '.solidfun/fundamentals')
    this.dirRead = dirname(fileURLToPath(import.meta.url))

    if (this.commandOptions.has('--verbose')) console.log(`✅ Read: ${configPath}`)
  }


  static #getEnv() {
    const env = process.argv[3]
    if (!env) throw new Error(errors.wrongEnv())
    return env
  }


  /** The config defined at `./fun.config` */
  static async #getConfig(cwd: string) {
    const configPath = resolve(cwd, 'fun.config.js')
    const module = await import(configPath)
    const config = module?.config ? module.config : null

    if (!config) throw new Error(errors.noConfig)

    return { config, configPath }
  }


  static #getBaseUrl(env: string, config: FunConfig) {
    let baseUrl

    if (config?.envs) {
      for (let configEnv of config.envs) {
        if (env === configEnv.name) {
          baseUrl = configEnv.url
          break
        }
      }
    }
  
    if (!baseUrl) throw new Error(errors.wrongEnv(env))

    return baseUrl
  }
}



/**
 * - A fundamental is a file that has helpful stuff in it
 * - A collection of these files is a plugin
 * - Users opt into fundamentals by opting into plugins
 * - So by opting into a plugin, users opt into a set of fundamentals
 * - When building the fundamentals, this whitelist helps us know what fundamentals to build
 */
class FundamentalWhiteList {
  /** When building the fundamentals, this whitelist helps us know what fundamentals to build */
  set: Set<string>

  constructor() {
    this.set = new Set()
  }

  /**
   * - Adds fundamentals to the whitelist if they live in plugins the `./fun.config.js` requests
   * @returns Unaltered `config`
   */
  populate(config: FunConfig) {
    fundamentals.forEach((f, name) => {
      if (config.plugins[f.pluginName]) { // IF this fundamentals plugin is `true` @ `./fun.config.js`
        this.set.add(name) // add this fundamental to the whitelist, b/c this is a fundamental that lives in a requested plugin
      }
    })

    return config
  }
}


export type Route = {
  /** Path starting from fs root */
  fsPath: string,
  /** Path defined @ new Route() */
  routePath: string,
  /** Name that will be used as import default name in generated file */
  moduleName: string,
}


/**
 * - Each node has it's own value (`moduleName`, `fsPath`, `routes`) and a map to more nodes (`layouts`)
 * - Routes that do not have layouts go into the root routes
 * - This way we can print the routes like a tree
 */
export type TreeNode = {
  moduleName: string,
  fsPath?: string,
  routes: Route[],
  layouts: Map<string,TreeNode>
}


type Writes = {
  types: string,
  imports: string,
  pipeGET: string,
  pipePOST: string,
  constGET: string,
  constPOST: string,
  pipeRoutes: string,
}


/**
 * `Map<fsPath, moduleName>`
 */
export type ImportsMap = Map<string,string>


export type TreeAccumulator = { importsMap: ImportsMap, consts: string, routes: '' }


/**
 * 
 * **Example:**
 * ```ts
 * export const routes = {
 *   '/': route_1,
 *   '/about': route_2,
 *   '/smooth': route_3,
 * }
 * ```
*/
export const getConstEntry = (urlPath: string, moduleName: string, apiModuleName?: keyof typeof supportedApiMethods) => `  '${urlPath}': ${moduleName}${apiModuleName ? '.' + apiModuleName : ''},\n`


export function getImportEntry (moduleName: string, fsPath: string, star: boolean, dir: 'apiDir' | 'appDir', build: Build){
  return `import ${star ? '* as ' : ''}${moduleName} from '${getRelativeImportPath(fsPath, build.config[dir] || '')}'\n`
} 


/**
 * @param fsPath Example: `/Users/brucewayne/justiceleague/src/api/example` - Path in file system to asset
 * @param destDir Example: `./src/api` - As set in fun.config.js
 * @returns Example: `../../src/api/contracts` - Relative path to asset
 * - B/c we know:
 *     - `fundamentals` is 2 folders in from root
 *     - How to get from root to api folder
 */
function getRelativeImportPath(fsPath: string, destDir: string): string {
  const root = process.cwd() // fs path to package.json directory
  const rootToDest = path.relative(root, destDir) // fun config path relative to package.json directory
  const split = fsPath.split(rootToDest)
  const withExtension = '../../' + rootToDest + split[1]
  const withoutExtension = withExtension.replace('.tsx', '').replace('.ts', '')

  return withoutExtension
}


const errors = {
  noConfig: '❌ Please export a config const @ "./fun.config.js"',
  noGenTypesTxt: '❌ Please re download solidfun b/c "/** gen */" was not found in your "dist/types.d.txt" and that is odd',
  wrongEnv: (env?: string) => `❌ Please call with an "env" that is defined @ "./fun.config.js". The env "${env}" did not match any environments set there`
} as const
