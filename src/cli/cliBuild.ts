import { fileURLToPath } from 'node:url'
import { cliErrors } from './cliErrors.js'
import type { FunConfig } from '../index.js'
import { join, resolve, dirname } from 'node:path'
import { publicMods, privateMods } from '../mods.js'
import { mkdir, readdir, writeFile, readFile, copyFile } from 'node:fs/promises'



class Questions {
  array: Question[] = []

  map = {
    valibot: new Question('valibot', '🚨 Include Valibot Fundamentals?'),
    mongoose: new Question('mongoose', '📀 Include Mongoose Fundamentals?'),
  }

  constructor() {
    this.array = [ // here we specify the question order
      this.map.mongoose,
      this.map.valibot
    ]
  }
}



/**
 * - Build types, components and functions for an `Solid Fun` environment!
 * - Options:
 *     - `--verbose`: Log what's happening + extra logs during wizard
 *     - `--all`: No wizard + include mongoose and valibot fundamentals
 *     - `--solid`: No wizard + do not include mongoose or valibot fundamentals
 *     - `--mongoose`: No wizard + include mongoose fundamentals
 *     - `--valibot`: No wizard + include valibot fundamentals
 * - Examples:
 *     - `fun build local`
 *     - `fun build prod --all`
 *     - `fun build local --solid --verbose`
 */
export async function cliBuild(cwd: CWD) {  
  const { options, questions, blackList, wizardRequested } = initVariables()

  if (wizardRequested) await showWizard(questions)

  blackList.populate(questions)
  await readWrite(cwd, options, questions, blackList, wizardRequested)
}


async function showWizard(questions: Questions) {
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding('utf8')

  for (const q of questions.array) {
    q.answer = await askQuestion(q)
  }

  process.stdin.setRawMode(false) 
  process.stdin.pause()
}


function initVariables() {
  const options = new Options()
  const questions = new Questions()
  const blackList = new ModuleBlackList()

  /** start w/ 'true' and then if they as for anything specific flip to 'false' */
  let wizardRequested = true

  if (options.has('solid')) wizardRequested = false // solid is the default so nothing else changes but a wizard bypass

  if (options.has('mongoose')) {
    wizardRequested = false
    questions.map.mongoose.answer = 'yes'
  }

  if (options.has('valibot')) {
    wizardRequested = false
    questions.map.valibot.answer = 'yes'
  }

  if (options.has('all')) { // yes to all
    wizardRequested = false    
    questions.array.forEach(q => q.answer = 'yes')
  }

  return {
    options,
    blackList,
    questions,
    wizardRequested,
  }
}


function askQuestion(question: Question): Promise<Answer> {
  return new Promise((resolve) => {
    let currentSelection: Answer = 'yes'

    const reset = '\x1b[0m'
    const white = '\x1b[97m'
    const gray = '\x1b[90m'

    const printUI = () => {
      console.clear()
      console.log(question.text)

      if (currentSelection === 'yes') console.log(`${white}[Yes please]${reset} / ${gray}No${reset}`)
      else console.log(`${gray}Yes${reset} / ${white}[No thanks]${reset}`)
    }


    function onKeyPress(key: string) {
      if (key === '\u0003') process.exit() // ctrl+c   
      else if (key === '\u001B') process.exit() // escape
      else if (key === '\u001B[D') { // left arrow 
        currentSelection = 'yes'
        printUI()
      } else if (key === '\u001B[C') { // right arrow
        currentSelection = 'no'
        printUI() 
      } else if (key === '\r') { // enter
        process.stdin.removeListener('data', onKeyPress)
        resolve(currentSelection)
      }
    }

    process.stdin.on('data', onKeyPress)

    printUI()
  })
}


async function readWrite(cwd: string,  options: Options, questions: Questions, blackList: ModuleBlackList, wizardRequested: boolean) {
  const layouts: Layouts = new Map()
  const noLayoutRoutes: Route[] = [] 
  let apiCounts: APICounts = { GET: 0, POST: 0 }
  const writes: Writes = { types: '', imports: '', pipeGET: '', pipePOST: '', constGET: '', constPOST: '', pipeRoutes: '' }

  const env = getEnv()
  const config = await getConfig(cwd, options)
  const baseUrl = getBaseUrl(env, config)
  const dirWriteRoot = join(cwd, '.solidfun')
  const dirWritePub = join(cwd, '.solidfun/pub')
  const dirRead = dirname(fileURLToPath(import.meta.url))

  const [pubTypesContent] = await Promise.all([
    readFile(join(dirRead, '../../types.d.txt'), 'utf-8'),
    apiInfo(writes, apiCounts, resolve(cwd, config.apiDir)),
    appInfo(writes, layouts, noLayoutRoutes, resolve(cwd, config.appDir)),
  ])

  await write({ env, config, writes, layouts, noLayoutRoutes, baseUrl, dirRead, dirWriteRoot, dirWritePub, pubTypesContent, questions, options, wizardRequested, blackList })
}



/** The config defined at ./fun.config */
async function getConfig(cwd: CWD, options: Options): Promise<FunConfig> {
  const name = 'fun.config.js'
  const configPath = resolve(cwd, name)
  const module = await import(configPath)
  const config = module?.config ? module.config : null

  if (!config) throw new Error(cliErrors.noConfig)
  if (options.has('verbose')) console.log(`✅ Read: ${configPath}`)

  return config
}



/** Define the fsPath, and urlPath for each api w/in the provided directory */
async function apiInfo(writes: Writes, apiCounts: APICounts, dir: string): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fsPath = join(dir, entry.name);

    if (entry.isDirectory()) await apiInfo(writes, apiCounts, fsPath)
    else if (entry.isFile() && fsPath.endsWith('.ts')) {
      const content = await readFile(fsPath, 'utf-8')
      const cleanedContent = removeComments(content)

      const getPath = getApiPathFor('GET', cleanedContent)
      const postPath = getApiPathFor('POST', cleanedContent)

      if (getPath) {
        apiCounts.GET++
        writes.pipeGET += getPipeEntry(getPath)
        writes.imports += getImportEntry('GET' + apiCounts.GET, fsPath, true)
        writes.constGET += getConstEntry(getPath, 'GET' + apiCounts.GET, 'GET')
      }

      if (postPath) {
        apiCounts.POST++
        writes.pipePOST += getPipeEntry(postPath)
        writes.imports += getImportEntry('POST' + apiCounts.POST, fsPath, true)
        writes.constPOST += getConstEntry(postPath, 'POST' + apiCounts.POST, 'POST')
      }
    }
  }
}


/** Define the fsPath, fsLayoutPath, and urlPath for each route w/in the provided directory */
async function appInfo(writes: Writes, layouts: Layouts, noLayoutRoutes: Route[], dir: string): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fsPath = join(dir, entry.name)

    if (entry.isDirectory()) await appInfo(writes, layouts, noLayoutRoutes, fsPath)
    else if (entry.isFile() && fsPath.endsWith('.tsx')) {
      const content = await readFile(fsPath, 'utf-8')
      const cleanedContent = removeComments(content)
      const match = /export\s+default[\s\S]*?path\s*:\s*(['"`])([^'"`]+)\1/.exec(cleanedContent)

      if (match) { // match[2] is the path for the route
        const urlPath = (match[2] || '').trim()
        const route: Route = { fsPath, urlPath }
        const nameOfLayout = getLayout(cleanedContent)

        writes.pipeRoutes += getPipeEntry(route.urlPath)

        if (nameOfLayout) {
          const layoutImportPath = getLayoutFrom(cleanedContent, nameOfLayout)

          if (layoutImportPath) {
            route.fsLayoutPath = resolve(dirname(fsPath), layoutImportPath)

            const mapRes = layouts.get(route.fsLayoutPath)

            if (!mapRes) layouts.set(route.fsLayoutPath, { name: 'layout' + (layouts.size + 1), routes: [route] })
            else mapRes.routes.push(route)

            route.moduleName = `route_${layouts.size}_${mapRes ? mapRes.routes.length : 1}`
          }
        } else {
          noLayoutRoutes.push(route)
          route.moduleName = `route_${noLayoutRoutes.length}`
        }
      }
    }
  }
}


async function write({ env, config, writes, layouts, noLayoutRoutes, baseUrl, dirRead, dirWriteRoot, dirWritePub, pubTypesContent, options, questions, wizardRequested, blackList }: { env: string, config: FunConfig, writes: Writes, layouts: Layouts, noLayoutRoutes: Route[], baseUrl: string, dirRead: string, dirWriteRoot: string, dirWritePub: string, pubTypesContent: string, options: Options, questions: Questions, wizardRequested: boolean, blackList: ModuleBlackList }) {
  const space = '\n'

  await mkdir(dirWritePub, { recursive: true })

  await Promise.all([
    fsWrite({ dir: dirWritePub, content: getApiContent(writes, space), fileName: 'apis.ts', options }),
    fsCopy({ dirRead, dirWrite: dirWriteRoot, srcFileName: 'tsconfig.cliBuild.txt', aimFileName: 'tsconfig.json', options }),
    fsWrite({ dir: dirWritePub, content: getEnvContent(env, config, baseUrl), fileName: 'env.ts', options }),
    fsWrite({ dir: dirWritePub, content: getTypesContent(writes, pubTypesContent), fileName: 'types.d.ts', options }),
    fsWrite({ dir: dirWritePub, content: getAppContent(layouts, noLayoutRoutes, space), fileName: 'app.tsx', options }),
    privateMods.map(([filename, ext]) => fsCopy({ dirRead, dirWrite: dirWriteRoot, srcFileName: filename +'.txt', aimFileName: filename +'.'+ ext, options })),
    publicMods
      .filter(mod => !blackList.mods.has(mod[0] as string))
      .map(([filename, ext]) => fsCopy({ dirRead, dirWrite: dirWritePub, srcFileName: filename +'.txt', aimFileName: filename +'.'+ ext, options })),
  ])

  if (!options.has('verbose')) {
    if (wizardRequested) console.clear()
    console.log(`✅ Wrote: .solidfun`)
  }
}


async function fsWrite({ dir, content, fileName, options }: { dir: string, content: string, fileName: string, options: Options }) {
  await writeFile(resolve(join(dir, fileName)), content, 'utf8')
  if (options.has('verbose')) console.log('✅ Wrote: ' + join(dir, fileName))
}


async function fsCopy({ dirRead, dirWrite, srcFileName, aimFileName, options }: { dirRead: string, dirWrite: string, srcFileName: string, aimFileName: string, options: Options }){
  await copyFile(join(dirRead, '../../' + srcFileName), join(dirWrite, aimFileName))
  if (options.has('verbose')) console.log('✅ Wrote: ' + join(dirWrite, aimFileName))
}


function getDynamicTypesContent(writes: Writes) {
  return `/** Current application routes */
export type Routes = ${!writes.pipeRoutes ? 'string' : writes.pipeRoutes.slice(0,-2)}


/** Current api GET endpoint url paths */
export type GET_Paths = ${!writes.pipeGET ? 'string' : writes.pipeGET.slice(0,-2)}


/** Current api POST endpoint url paths */
export type POST_Paths = ${!writes.pipePOST ? 'string' : writes.pipePOST.slice(0,-2)}\n`
}


function getTypesContent(writes: Writes, pubTypesContent: string) {
  const index = pubTypesContent.indexOf('/** gen */')

  if (index === -1) throw new Error(cliErrors.noGenTypesTxt)

  return pubTypesContent.slice(0, index) + getDynamicTypesContent(writes)
}




function getApiContent(writes: Writes, space: string) {
  return `${writes.imports}${space}
export const gets = {
${writes.constGET.slice(0,-1)}
}
${space}
export const posts = {
${writes.constPOST.slice(0,-1)}
}
`
}

function getAppContent(layouts: Layouts, noLayoutRoutes: Route[], space: string) {
  let app = ''
  let imports = ''
  let constRoute = ''

  noLayoutRoutes.forEach(route => {
    imports += getImportEntry(route.moduleName as string, route.fsPath, false)
    constRoute += getConstEntry(route.urlPath, route.moduleName as string)
    app += `    <Route path={${route.moduleName}.path} component={${route.moduleName}.component} matchFilters={${route.moduleName}.filters} />\n`
  })

  layouts.forEach((layout, fsPath) => {
    imports += getImportEntry(layout.name, fsPath, false)

    app +=`    <Route component={${layout.name}.component}>\n`

    layout.routes.forEach(route => {
      imports += getImportEntry(route.moduleName as string, route.fsPath, false)
      constRoute += getConstEntry(route.urlPath, route.moduleName as string)
      app += `      <Route path={${route.moduleName}.path} component={${route.moduleName}.component} matchFilters={${route.moduleName}.filters} />\n`
    })

    app += `    </Route>\n`
  })

  return `/**
 * 🧚‍♀️ How to access:
 *     - import { routes, App } from '@solidfun/app'
 */


import { Suspense } from 'solid-js'
import { MetaProvider } from '@solidjs/meta'
import { Route, Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'


${imports}\n
export const routes = {
${constRoute.slice(0,-2)}
}
${space}
export const App = () => <>
  <Router root={ (props) => <> <MetaProvider> <Suspense>{props.children}</Suspense> </MetaProvider> </> }>
    <FileRoutes />
${app.slice(0,-1)}
  </Router>
</>
`
}


function getEnvContent(env: string, config: FunConfig, baseUrl: string) {
  return `export const env: ${config.envs.map(env => `'${env.name}'`).join(' | ')} = '${env}'
export const url: ${config.envs.map(env => `'${env.url}'`).join(' | ')} = '${baseUrl}'
`
}

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


function getEnv() {
  const env = process.argv[3]

  if (!env) throw new Error(cliErrors.wrongEnv())

  return env
}


function getBaseUrl(env: string, config: FunConfig): string {
  let baseUrl

  for (let configEnv of config.envs) {
    if (env === configEnv.name) {
      baseUrl = configEnv.url
      break
    }
  }

  if (!baseUrl) throw new Error(cliErrors.wrongEnv(env))

  return baseUrl
}


function removeComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
}


const supportedApiMethods = { GET: 'GET', POST: 'POST' } as const


class Question {
  /** Name of module, examples: `(route, mongoose, valibot)` */
  mod: string
  /** The `question` */
  text: string
  /** Should this `mod` be built? `yes` or `no` */
  answer: Answer

  constructor(mod: string, text: string) {
    this.mod = mod
    this.text = text
    this.answer = 'no'
  }
}


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


/** The modules that won't be built */
class ModuleBlackList {
  mods: Set<string>

  constructor() {
    this.mods = new Set()
  }

  populate(questions: Questions) {
    for (const q of questions.array) {
      if (q.answer === 'no') this.mods.add(q.mod)
    }
  }
}


const availableOptions = {
  all: 'all',
  solid: 'solid',
  verbose: 'verbose',
  valibot: 'valibot',
  mongoose: 'mongoose',
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

type APICounts = {
  GET: 0,
  POST: 0
}

type Answer = 'yes' | 'no'

type CWD = string
