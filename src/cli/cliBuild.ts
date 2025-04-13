import { fileURLToPath } from 'node:url'
import { cliErrors } from './cliErrors.js'
import type { FunConfig } from '../index.js'
import { fundamentals } from '../fundamentals.js'
import { join, resolve, dirname } from 'node:path'
import { mkdir, readdir, writeFile, readFile, copyFile } from 'node:fs/promises'



/**
 * - Build types, components and functions for a `Solid Fun` environment!
 * - Configure w/ "fun.config.js" @ your cwd
 * - Options:
 *     - `--verbose`: Log what's happening + extra logs during wizard
 */
export async function cliBuild(cwd: string) {
  const athena = await Athena.Create(cwd)

  if (athena.config.plugins.solid) {
    await Promise.all([
      mkdir(athena.dirWriteFundamentals, { recursive: true }),
      athena.doInitialSolidReads()
    ])
  }

  await Promise.all(athena.getWritePromises())

  if (!athena.options.has('verbose')) console.log(`✅ Wrote: .solidfun`)
}



/**
 * - From a tree shakability perspective, functions > classes, but all in this file needs all else and there are a lot of variables & functions so a class is perfect b/c w/o it there'd be a lot of variable argument passing
 * - Think of Athena like Jarvis or Alfred, hold all my stuff and do some stuff w/ it please
 */
class Athena {
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
  layouts: Layouts = new Map()
  options: Options = new Options()
  noLayoutRoutes: Route[] = [] 
  whiteList: FundamentalWhiteList = new FundamentalWhiteList()
  apiCounts: { GET: number, POST: number } = { GET: 0, POST: 0 }
  writes: Writes = { types: '', imports: '', pipeGET: '', pipePOST: '', constGET: '', constPOST: '', pipeRoutes: '' }


  private constructor(cwd: string, env: string, baseUrl: string, config: FunConfig, configPath: string) {
    this.cwd = cwd
    this.env = env
    this.baseUrl = baseUrl
    this.config = this.whiteList.populate(config)

    this.dirWriteRoot = join(cwd, '.solidfun')
    this.dirWriteFundamentals = join(cwd, '.solidfun/fundamentals')
    this.dirRead = dirname(fileURLToPath(import.meta.url))

    if (this.options.has('verbose')) console.log(`✅ Read: ${configPath}`)
  }


  /**
   * - Get the environment specified in the command
   * - Get the config
   * - Get the env baseUrl
   * - Populate the white list
   * - Populate lots of helpful variables
   * @param cwd - Common working directory
   * @returns athena object that has lost of helpful variables and functions to do w/ those variables
   */
  static async Create(cwd: string) {
    const env = Athena.#getEnv()
    const {config, configPath} = await Athena.#getConfig(cwd)
    const baseUrl = Athena.#getBaseUrl(env, config)
    return new Athena(cwd, env, baseUrl, config, configPath)
  }


  static #getEnv() {
    const env = process.argv[3]
    if (!env) throw new Error(cliErrors.wrongEnv())
    return env
  }


  /** The config defined at ./fun.config */
  static async #getConfig(cwd: string) {
    const configPath = resolve(cwd, 'fun.config.js')
    const module = await import(configPath)
    const config = module?.config ? module.config : null
  
    if (!config) throw new Error(cliErrors.noConfig)
  
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
  
    if (!baseUrl) throw new Error(cliErrors.wrongEnv(env))

    return baseUrl
  }


  async doInitialSolidReads() {  
    if (this.config.plugins.solid) {
      if (!this.config.apiDir || typeof this.config.apiDir !== 'string') throw new Error('❌ When using the solid plugin, `config.apiDir` must be a truthy string')
      if (!this.config.appDir || typeof this.config.appDir !== 'string') throw new Error('❌ When using the solid plugin, `config.appDir` must be a truthy string')
  
      const [app, types] = await Promise.all([
        readFile(join(this.dirRead, '../../app.txt'), 'utf-8'),
        readFile(join(this.dirRead, '../../types.d.txt'), 'utf-8'),
        this.#bindApiData(resolve(this.cwd, this.config.apiDir)),
        this.#bindAppData(resolve(this.cwd, this.config.appDir)),
      ])

      this.fsApp = app
      this.fsSolidTypes = types
    }
  }


  /** Define the fsPath, and urlPath for each api w/in the provided directory */
  async #bindApiData(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fsPath = join(dir, entry.name);

      if (entry.isDirectory()) await this.#bindApiData(fsPath)
      else if (entry.isFile() && fsPath.endsWith('.ts')) {
        const content = await readFile(fsPath, 'utf-8')
        const cleanedContent = removeComments(content)

        const getPath = getApiPathFor('GET', cleanedContent)
        const postPath = getApiPathFor('POST', cleanedContent)

        if (getPath) {
          this.apiCounts.GET++
          this.writes.pipeGET += getPipeEntry(getPath)
          this.writes.imports += getImportEntry('GET' + this.apiCounts.GET, fsPath, true)
          this.writes.constGET += getConstEntry(getPath, 'GET' + this.apiCounts.GET, 'GET')
        }

        if (postPath) {
          this.apiCounts.POST++
          this. writes.pipePOST += getPipeEntry(postPath)
          this.writes.imports += getImportEntry('POST' + this.apiCounts.POST, fsPath, true)
          this.writes.constPOST += getConstEntry(postPath, 'POST' + this.apiCounts.POST, 'POST')
        }
      }
    }
  }


  /** Define the fsPath, fsLayoutPath, and urlPath for each route w/in the provided directory */
  async #bindAppData(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fsPath = join(dir, entry.name)

      if (entry.isDirectory()) await this.#bindAppData(fsPath)
      else if (entry.isFile() && fsPath.endsWith('.tsx')) {
        const content = await readFile(fsPath, 'utf-8')
        const cleanedContent = removeComments(content)
        const match = /export\s+default[\s\S]*?path\s*:\s*(['"`])([^'"`]+)\1/.exec(cleanedContent)

        if (match) { // match[2] is the path for the route
          const urlPath = (match[2] || '').trim()
          const route: Route = { fsPath, urlPath }
          const nameOfLayout = getLayout(cleanedContent)

          this.writes.pipeRoutes += getPipeEntry(route.urlPath)

          if (nameOfLayout) {
            const layoutImportPath = getLayoutFrom(cleanedContent, nameOfLayout)

            if (layoutImportPath) {
              route.fsLayoutPath = resolve(dirname(fsPath), layoutImportPath)

              const mapRes = this.layouts.get(route.fsLayoutPath)

              if (!mapRes) this.layouts.set(route.fsLayoutPath, { name: 'layout' + (this.layouts.size + 1), routes: [route] })
              else mapRes.routes.push(route)

              route.moduleName = `route_${this.layouts.size}_${mapRes ? mapRes.routes.length : 1}`
            }
          } else {
            this.noLayoutRoutes.push(route)
            route.moduleName = `route_${this.noLayoutRoutes.length}`
          }
        }
      }
    }
  }


  getWritePromises() {
    const promises: Promise<any>[] = []

    fundamentals.forEach((f, name) => {
      switch(f.type) {
        case 'copy':
          if (this.whiteList.set.has(name)) {
            promises.push(this.#fsCopy({ dirWrite: this.dirWriteFundamentals, srcFileName: `${name}.txt`, aimFileName: `${name}.${f.ext}` }))
          }
          break
        case 'helper':
          if (this.whiteList.set.has(name)) {
            promises.push(this.#fsCopy({ dirWrite: this.dirWriteRoot, srcFileName: `${name}.txt`, aimFileName: `${name}.${f.ext}` }))
          }
          break
      }
    })

    if (this.config.plugins.solid) {
      promises.push(
        this.#fsWrite({ dir: this.dirWriteFundamentals, content: this.#getApiContent(), fileName: 'apis.ts' }),
        this.#fsWrite({ dir: this.dirWriteFundamentals, content: this.#getEnvContent(), fileName: 'env.ts' }),
        this.#fsWrite({ dir: this.dirWriteFundamentals, content: this.#getTypesContent(), fileName: 'types.d.ts' }),
        this.#fsWrite({ dir: this.dirWriteFundamentals, content: this.#getAppContent(), fileName: 'app.tsx' }),
      )
    }

    return promises
  }


  #getApiContent() {
    return `${this.writes.imports}${this.space}
export const gets = {
  ${this.writes.constGET.slice(0,-1)}
}
  ${this.space}
export const posts = {
  ${this.writes.constPOST.slice(0,-1)}
}
  `
  }


  #getEnvContent() {
    return `export const env: ${this.config.envs?.map(env => `'${env.name}'`).join(' | ')} = '${this.env}'
export const url: ${this.config.envs?.map(env => `'${env.url}'`).join(' | ')} = '${this.baseUrl}'
  `
  }


  #getTypesContent() {
    const index = this.fsSolidTypes?.indexOf('/** gen */')
  
    if (index === -1) throw new Error(cliErrors.noGenTypesTxt)
  
    return this.fsSolidTypes?.slice(0, index) + this.#getDynamicTypesContent()
  }


  #getDynamicTypesContent() {
    return `/** Current application routes */
export type Routes = ${!this.writes.pipeRoutes ? 'string' : this.writes.pipeRoutes.slice(0,-2)}
  
  
/** Current api GET endpoint url paths */
export type GET_Paths = ${!this.writes.pipeGET ? 'string' : this.writes.pipeGET.slice(0,-2)}
  
  
 /** Current api POST endpoint url paths */
export type POST_Paths = ${!this.writes.pipePOST ? 'string' : this.writes.pipePOST.slice(0,-2)}\n`
  }


  #getAppContent () {
    let app = ''
    let imports = ''
    let constRoute = ''
  
    this.noLayoutRoutes.forEach(route => {
      imports += getImportEntry(route.moduleName as string, route.fsPath, false)
      constRoute += getConstEntry(route.urlPath, route.moduleName as string)
      app += `    <Route path={${route.moduleName}.path} component={${getComponentContent(route.moduleName)}} matchFilters={${route.moduleName}.filters} />\n`
    })
  
    this.layouts.forEach((layout, fsPath) => {
      imports += getImportEntry(layout.name, fsPath, false)
  
      app +=`    <Route component={${getComponentContent(layout.name)}}>\n`
  
      layout.routes.forEach(route => {
        imports += getImportEntry(route.moduleName as string, route.fsPath, false)
        constRoute += getConstEntry(route.urlPath, route.moduleName as string)
        app += `      <Route path={${route.moduleName}.path} component={${getComponentContent(route.moduleName)}} matchFilters={${route.moduleName}.filters} />\n`
      })
  
      app += `    </Route>\n`
    })

    const marker = '/** gen */'
    const marker1Index = this.fsApp?.indexOf(marker) || 0
    const marker2Index = this.fsApp?.indexOf(marker, marker1Index + marker.length) || 0 // start searching after marker 1

    // aggregate dynamic data
    const dynamic = `${imports}\n
export const routes = {
${constRoute.slice(0,-2)}
}
${this.space}
/**
 * - \`<App />\` takes an optional \`root\` prop which is a function of type \`RouterRoot\` and demonstrated @ \`InternalRouterRoot\`
 * - The primary reason to pass your own root is if you'd love additional context providers
 * - As seen @ \`InternalRouterRoot\` and below, root children must be wrapped around \`<Suspense>\`, \`<MetaProvider>\` and \`<FE_ContextProvider>\`
 * - After \`<FE_ContextProvider>\` please feel free to continue wrapping
 * - Simple example \`app.tsx\`:
        \`\`\`tsx
        import { App } from '@solidfun/app'

        export default () => <App root={root}/>
        \`\`\`
 * - Custom Example \`app.tsx\`:
        \`\`\`tsx
        import { Suspense } from 'solid-js'
        import { MetaProvider } from '@solidjs/meta'
        import { App, type RouterRoot } from '@solidfun/app'
        import { FE_ContextProvider } from '@solidfun/feContext'
        import type { RouteSectionProps } from '@solidjs/router'
        import { AdditionalProvider } from '@src/lib/exampleContext'

        const root: RouterRoot = (props: RouteSectionProps) => {
            return <>
                <AdditionalProvider>
                    <FE_ContextProvider>
                        <MetaProvider>
                            <Suspense>{props.children}</Suspense>
                        </MetaProvider>
                    </FE_ContextProvider>
                </AdditionalProvider>
            </> 
        }

        export default () => <App root={root}/>
        \`\`\` */
export const App = ({ root }: { root?: RouterRoot }) => <>
  <Router root={root || InternalRouterRoot}>
    <FileRoutes />
${app.slice(0,-1)}
  </Router>
</>
`
    /**
     * - Part 1: `this.fsApp?.slice(0, marker1Index)`
     * - Part 2: `dynamic`
     * - Part 3: `this.fsApp?.slice(marker2Index + marker.length)`
     *     - Adding the marker length allows us to remove the marker from the output
     */
    const content = this.fsApp?.slice(0, marker1Index) + dynamic + this.fsApp?.slice(marker2Index + marker.length)

    return content
  }


  async #fsWrite({ dir, content, fileName }: { dir: string, content: string, fileName: string }) {
    await writeFile(resolve(join(dir, fileName)), content, 'utf8')
    if (this.options.has('verbose')) console.log('✅ Wrote: ' + join(dir, fileName))
  }
  
  
  async #fsCopy({ dirWrite, srcFileName, aimFileName }: { dirWrite: string, srcFileName: string, aimFileName: string }){
    await copyFile(join(this.dirRead, '../../' + srcFileName), join(dirWrite, aimFileName))
    if (this.options.has('verbose')) console.log('✅ Wrote: ' + join(dirWrite, aimFileName))
  }
}


const getComponentContent = (moduleName?: string) => `props => rc(props, ${moduleName})`

const getImportEntry = (name: string, fsPath: string, star: boolean) => `import ${star ? '* as ' : ''}${name} from '${fsPath.replace(/\.tsx?$/, '')}'\n`

const getConstEntry = (urlPath: string, moduleName: string, apiModuleName?: keyof typeof supportedApiMethods) => `  '${urlPath}': ${moduleName}${apiModuleName ? '.' + apiModuleName : ''},\n`

const getPipeEntry = (path: string) => `'${path}' | `


/**  Get the name the layout is identified as in the route file */
function getLayout(content: string): string | undefined {
  const layoutMatch = /layout\s*:\s*([A-Za-z0-9_$]+)/.exec(content)
  return layoutMatch ? layoutMatch[1] : undefined
}


/** Get import from value based on name of the layout in the file */
function getLayoutFrom(content: string, identifier: string): string | undefined {
  const importRegex = new RegExp(`import\\s+${identifier}\\s+from\\s+(['"])([^'"]+)\\1`)
  const match = importRegex.exec(content)

  return match ? match[2] : undefined;
}


/** Provide the content of a file and if we want the GET or POST path and get it back or null */
function getApiPathFor(exportName: 'GET' | 'POST', content: string): string | null {
  const exportRegex = new RegExp(`export const ${exportName}\\s*=`, 'g');
  const match = exportRegex.exec(content);

  if (match) { // export const GET or POST is w/in this content
    const subContent = content.slice(match.index) // find the path *after* the matched export
    const pathMatch = /path\s*:\s*(['"`])([^'"`]+)\1/.exec(subContent);

    return pathMatch ? (pathMatch[2] || '').trim() : null // the path for the api
  }

  return null
}


function removeComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
}


const supportedApiMethods = { GET: 'GET', POST: 'POST' } as const


class Options {
  current: Set<string>

  constructor() {
    this.current = new Set(process.argv.filter(arg => arg.startsWith('--')))
  }

  /** @param option Does the current command have this "option" */
  has(option: keyof typeof availableOptions) {
    return this.current.has('--' + option)
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


const availableOptions = {
  verbose: 'verbose',
}


type Route = {
  fsPath: string,
  urlPath: string,
  moduleName?: string,
  fsLayoutPath?: string,
}

/** key is fsPath, routes is their fsPaths' */
type Layouts = Map<string, { name: string, routes: Route[] }>

type Writes = {
  types: string,
  imports: string,
  pipeGET: string,
  pipePOST: string,
  constGET: string,
  constPOST: string,
  pipeRoutes: string,
}
