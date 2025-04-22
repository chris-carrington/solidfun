import { join, resolve } from 'node:path'
import { fundamentals } from '../../fundamentals.js'
import { mkdir, copyFile, writeFile } from 'node:fs/promises'
import { getConstEntry, getImportEntry, type Build, type TreeAccumulator, type TreeNode } from './build.js'



export async function buildWrite(build: Build) {
  await mkdir(build.dirWriteFundamentals, { recursive: true })
  await Promise.all(getPromises(build))
}



function getPromises(build: Build) {
  const promises: Promise<any>[] = []

  fundamentals.forEach((f, name) => {
    switch(f.type) {
      case 'copy':
        if (build.whiteList.set.has(name)) {
          promises.push(fsCopy({ build, dirWrite: build.dirWriteFundamentals, srcFileName: `${name}.txt`, aimFileName: `${name}.${f.ext}` }))
        }
        break
      case 'helper':
        if (build.whiteList.set.has(name)) {
          promises.push(fsCopy({ build, dirWrite: build.dirWriteRoot, srcFileName: `${name}.txt`, aimFileName: `${name}.${f.ext}` }))
        }
        break
    }
  })

  if (build.config.plugins.solid) {
    promises.push(
      fsWrite({ build, dir: build.dirWriteFundamentals, content: renderEnv(build), fileName: 'env.ts' }),
      fsWrite({ build, dir: build.dirWriteFundamentals, content: renderApi(build), fileName: 'apis.ts' }),
      fsWrite({ build, dir: build.dirWriteFundamentals, content: renderApp(build), fileName: 'app.tsx' }),
      fsWrite({ build, dir: build.dirWriteFundamentals, content: renderTypes(build), fileName: 'types.d.ts' }),
    )
  }

  promises.push(fsCopy({ build, dirWrite: build.dirWriteRoot, srcFileName: 'tsconfig.txt', aimFileName: 'tsconfig.json' }))

  return promises
}



async function fsWrite({ dir, content, fileName, build }: { dir: string, content: string, fileName: string, build: Build }) {
  await writeFile(resolve(join(dir, fileName)), content, 'utf8')
  if (build.commandOptions.has('--verbose')) console.log('✅ Wrote: ' + join(dir, fileName))
}



async function fsCopy({ dirWrite, srcFileName, aimFileName, build }: { dirWrite: string, srcFileName: string, aimFileName: string, build: Build }){
  await copyFile(join(build.dirRead, '../../../' + srcFileName), join(dirWrite, aimFileName))
  if (build.commandOptions.has('--verbose')) console.log('✅ Wrote: ' + join(dirWrite, aimFileName))
}



function renderEnv(build: Build) {
  return `/**
* 🧚‍♀️ How to access:
*     - import { env, url } from '@solidfun/env'
*/


export const env: ${build.config.envs?.map(env => `'${env.name}'`).join(' | ')} = '${build.env}'
export const url: ${build.config.envs?.map(env => `'${env.url}'`).join(' | ')} = '${build.baseUrl}'
`
}



function renderApi(build: Build) {
  return `${build.writes.imports}${build.space}
export const gets = {
${build.writes.constGET.slice(0,-1)}
}
${build.space}
export const posts = {
${build.writes.constPOST.slice(0,-1)}
}
`
}



function renderApp(build: Build) {
  let imports = ''
  let {routes, importsMap, consts} = walkTree(build.tree)

  importsMap.forEach((moduleName, fsPath) => {
    imports += getImportEntry(moduleName, fsPath, false, 'appDir', build)
  })

  build.noLayoutRoutes.forEach(route => {
    imports += getImportEntry(route.moduleName, route.fsPath, false, 'appDir', build)
    consts += getConstEntry(route.routePath, route.moduleName)
    routes += `        <Route path={${route.moduleName}.path} component={${renderComponentProp('r', route.moduleName)}} matchFilters={${route.moduleName}.filters} />\n`
  })

  const marker = '/** gen */'
  const marker1Index = build.fsApp?.indexOf(marker) || 0
  const marker2Index = build.fsApp?.indexOf(marker, marker1Index + marker.length) || 0 // start searching after marker 1

  // aggregate dynamic data
  const dynamic = `${imports}\n
export const routes = {
${consts.slice(0,-2)}
}
${build.space}
/** 
* - Returns a function that when called provided an <App /> component
*/
export function createApp(Root = InternalRouterRoot) {
return function () {
  return <>
    <Router root={Root}>
      <FileRoutes />
${routes.slice(0,-1)}
    </Router>
  </>
}
}
`
  /**
   * - Part 1: `this.fsApp?.slice(0, marker1Index)`
   * - Part 2: `dynamic`
   * - Part 3: `this.fsApp?.slice(marker2Index + marker.length)`
   *     - Adding the marker length allows us to remove the marker from the output
   */
  const content = build.fsApp?.slice(0, marker1Index) + dynamic + build.fsApp?.slice(marker2Index + marker.length)

  return content
}



function renderTypes(build: Build) {
  const index = build.fsSolidTypes?.indexOf('/** gen */')

  if (index === -1) throw new Error(errors.noGenTypesTxt)

  return build.fsSolidTypes?.slice(0, index) + renderDynamicTypes(build)
}



function renderDynamicTypes(build: Build) {
  return `/** Current application routes */
export type Routes = ${!build.writes.pipeRoutes ? 'string' : build.writes.pipeRoutes.slice(0,-2)}


/** Current api GET endpoint url paths */
export type GET_Paths = ${!build.writes.pipeGET ? 'string' : build.writes.pipeGET.slice(0,-2)}


/** Current api POST endpoint url paths */
export type POST_Paths = ${!build.writes.pipePOST ? 'string' : build.writes.pipePOST.slice(0,-2)}\n`
}



/**
 * - Walk the entire tree, once, building the accumulator
 * - Accumulator: Mutable object that we pass along in a recursive function to collect or `accumulate` results as we go
 *   - `importsMap`: Map<fsPath, moduleName>
 *   - `consts`:    string[] of getConstEntry(...) lines
 */
function walkTree(node: TreeNode, indent = 8, accumulator: TreeAccumulator = { importsMap: new Map(), consts: '', routes: '' }) {
  if (node.fsPath) accumulator.importsMap.set(node.fsPath, node.moduleName) // layout import

  if (node.moduleName !== 'root') { // open <Route>, for layout, unless virtual root
    accumulator.routes += (' '.repeat(indent) + `<Route component={${renderComponentProp('l', node.moduleName)}}>\n`)
    indent += 2
  }

  for (const r of node.routes) { // for each route in this layout
    accumulator.importsMap.set(r.fsPath, r.moduleName) // set route import
    accumulator.consts += getConstEntry(r.routePath, r.moduleName) // set route const entry
    accumulator.routes += (' '.repeat(indent) + `<Route path={${r.moduleName}.path} component={${renderComponentProp('r', r.moduleName!)}} matchFilters={${r.moduleName!}.filters} />\n`) // set routes entry
  }

  for (const child of node.layouts.values()) { // recurse into each child layout
    walkTree(child, indent, accumulator)
  }

  if (node.moduleName !== 'root') { // if not root => close wrapper 
    indent -= 2
    accumulator.routes += (' '.repeat(indent) + `</Route>\n`)
  }

  return accumulator
}



const renderComponentProp = (prefix: 'r' | 'l', moduleName?: string) => `props => ${prefix}c(props, ${moduleName})`


const errors = {
  noConfig: '❌ Please export a config const @ "./fun.config.js"',
  noGenTypesTxt: '❌ Please re download solidfun b/c "/** gen */" was not found in your "dist/types.d.txt" and that is odd',
  wrongEnv: (env?: string) => `❌ Please call with an "env" that is defined @ "./fun.config.js". The env "${env}" did not match any environments set there`
} as const