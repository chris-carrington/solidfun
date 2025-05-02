import path, { join, resolve } from 'node:path'
import { readdir, readFile } from 'node:fs/promises'
import { getConstEntry, getImportEntry, ImportsMap, Route, type Build } from './build.js'


export async function buildRead(build: Build) {
  if (build.config.plugins.solid) {
    if (!build.config.apiDir || typeof build.config.apiDir !== 'string') throw new Error('❌ When using the solid plugin, `config.apiDir` must be a truthy string')
    if (!build.config.appDir || typeof build.config.appDir !== 'string') throw new Error('❌ When using the solid plugin, `config.appDir` must be a truthy string')

    const [fsApp, fsSolidTypes] = await Promise.all([
      readFile(join(build.dirRead, '../../../app.txt'), 'utf-8'),
      readFile(join(build.dirRead, '../../../types.d.txt'), 'utf-8'),
      readAPIDirectory(resolve(build.cwd, build.config.apiDir), build),
      readAppDirectory(resolve(build.cwd, build.config.appDir), build),
    ])

    build.fsApp = fsApp
    build.fsSolidTypes = fsSolidTypes
  }
}


async function readAPIDirectory(dir: string, build: Build) {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fsPath = join(dir, entry.name)

    if (entry.isDirectory()) await readAPIDirectory(fsPath, build)
    else if (entry.isFile() && fsPath.endsWith('.ts')) await setAPIWrites(fsPath, build)
  }
}


async function setAPIWrites(fsPath: string, build: Build): Promise<void> {
  const content = removeComments(await readFile(fsPath, 'utf-8'))

  /**
   * - Captures:
   *     - [1] → GET or POST
   *     - [3] → the path string (e.g. /api/character/:element)
   */
  const regex = /export\s+const\s+(GET|POST)\s*=\s*new\s+API\(\s*(['"`])(.+?)\2\)/g

  for (const matches of content.matchAll(regex)) {
    const apiMethod = matches[1]
    const apiPath = matches[3]

    if (apiMethod && apiPath) {
      switch (apiMethod) {
        case 'GET':
          build.counts.GET++
          build.writes.pipeGET += getPipeEntry(apiPath)
          build.writes.imports += getImportEntry('GET' + build.counts.GET, fsPath, true, 'apiDir', build)
          build.writes.constGET += getConstEntry(apiPath, 'GET' + build.counts.GET, 'GET')
          break
        case 'POST':
          build.counts.POST++
          build.writes.pipePOST += getPipeEntry(apiPath)
          build.writes.imports += getImportEntry('POST' + build.counts.POST, fsPath, true, 'apiDir', build)
          build.writes.constPOST += getConstEntry(apiPath, 'POST' + build.counts.POST, 'POST')
          break
      }
    }
  }
}


async function readAppDirectory(dir: string, build: Build): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fsPath = join(dir, entry.name)

    if (entry.isDirectory()) await readAppDirectory(fsPath, build)
    else if (entry.isFile() && fsPath.endsWith('.tsx')) {
      const src = removeComments(await readFile(fsPath,'utf-8'))
      const { routePath, fsLayouts } = doRouteRegex(dir, src)

      if (!routePath) continue // this tsx file has no export default new Route and then w/in that a route path

      build.counts.routes++
      build.writes.pipeRoutes += getPipeEntry(routePath)

      const route: Route = { fsPath, routePath, moduleName: `route_${build.counts.routes}` }

      let node = build.tree

      if (fsLayouts.length === 0) node.routes.push(route) // if no layouts, it lives under root
      else {
        for (const fsLayoutPath of fsLayouts) {
          if (!node.layouts.has(fsLayoutPath)) { // create that child node if it doesn't exist
            build.counts.layouts++
            node.layouts.set(fsLayoutPath, { moduleName: 'layout'+build.counts.layouts, fsPath: fsLayoutPath, routes: [], layouts: new Map() })
          }

          node = node.layouts.get(fsLayoutPath)! // descend into it
        }

        node.routes.push(route) // finally attach our route at this nested level
      }
    }
  }
}



function removeComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
}


/**
 * - Searches for Route definition, its path and its layouts (if it's got em)
 * @param dir directory
 * @param content Content of a file
 */
function doRouteRegex(dir: string, content: string) {
  /** 
   * - Paths as defined @ new Route()
   * - Layouts according to their fs position
   */
  const res: { routePath: string, fsLayouts: string[] } = { routePath: '', fsLayouts: [] }

  // find the position of `export default new Route`
  const regexExportDefault = /export\s+default\s+new\s+Route\s*\(\s*/m
  const matchExportDefault = regexExportDefault.exec(content)

  if (!matchExportDefault) return res // no export => no match

  const tail = content.slice(matchExportDefault.index + matchExportDefault[0].length) // all after export default

  // find the first `path:` in `tail`
  const regexPath = /^\s*(['"`])([^'"`]+)\1/
  const matchPath = regexPath.exec(tail)

  if (!matchPath || !matchPath[2]) return res // no path => no match

  res.routePath = matchPath[2]

  // find the first `layouts:` in `tail`
  const regexLayouts = /\.layouts\(\s*\[\s*([^\]]+?)\s*\]\s*\)/
  const matchLayouts = regexLayouts.exec(tail)

  if (matchLayouts && matchLayouts[1]) {
    const importsMap: ImportsMap = new Map()
    const regexImports = /^import\s+([A-Za-z_$][\w$]*)\s+from\s+(['"`])([^'"`]+)\2/gm
    const routeLayouts = matchLayouts[1] // split on commas, trimming any incidental spaces
      .split(/\s*,\s*/)
      .filter(name => name.length > 0)

    for (const matchImports of content.matchAll(regexImports)) {
      if (matchImports[1] && matchImports[3]) importsMap.set(matchImports[1], matchImports[3])
    }

    routeLayouts.forEach(routeLayout => {
      const importFromValue = importsMap.get(routeLayout)

      if (importFromValue) {
        const fsPath = path.resolve(dir, importFromValue)
        res.fsLayouts.push(fsPath)
      }
    })
  }

  return res
}


const getPipeEntry = (path: string) => `'${path}' | `
