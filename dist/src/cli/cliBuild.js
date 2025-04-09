import { fileURLToPath } from 'node:url';
import { cliErrors } from './cliErrors.js';
import { cliVerbose } from './cliVerbose.js';
import { join, resolve, dirname } from 'node:path';
import { publicMods, privateMods } from '../mods.js';
import { mkdir, readdir, writeFile, readFile, copyFile } from 'node:fs/promises';
export async function cliBuild(cwd) {
    const layouts = new Map();
    const noLayoutRoutes = [];
    let apiCounts = { GET: 0, POST: 0 };
    const writes = { types: '', imports: '', pipeGET: '', pipePOST: '', constGET: '', constPOST: '', pipeRoutes: '' };
    const env = getEnv();
    const config = await getConfig(cwd);
    const baseUrl = getBaseUrl(env, config);
    const dirWriteRoot = join(cwd, '.solidfun');
    const dirWritePub = join(cwd, '.solidfun/pub');
    const dirRead = dirname(fileURLToPath(import.meta.url));
    const [pubTypesContent] = await Promise.all([
        readFile(join(dirRead, '../../types.d.txt'), 'utf-8'),
        apiInfo(writes, apiCounts, resolve(cwd, config.apiDir)),
        appInfo(writes, layouts, noLayoutRoutes, resolve(cwd, config.appDir)),
    ]);
    await write({ env, config, writes, layouts, noLayoutRoutes, baseUrl, dirRead, dirWriteRoot, dirWritePub, pubTypesContent });
}
/** The config defined at ./fun.config */
async function getConfig(cwd) {
    const name = 'fun.config.js';
    const configPath = resolve(cwd, name);
    const module = await import(configPath);
    const config = module?.config ? module.config : null;
    if (!config)
        throw new Error(cliErrors.noConfig);
    if (cliVerbose())
        console.log(`✅ Read: ${configPath}`);
    return config;
}
/** Define the fsPath, and urlPath for each api w/in the provided directory */
async function apiInfo(writes, apiCounts, dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fsPath = join(dir, entry.name);
        if (entry.isDirectory())
            await apiInfo(writes, apiCounts, fsPath);
        else if (entry.isFile() && fsPath.endsWith('.ts')) {
            const content = await readFile(fsPath, 'utf-8');
            const cleanedContent = removeComments(content);
            const getPath = getApiPathFor('GET', cleanedContent);
            const postPath = getApiPathFor('POST', cleanedContent);
            if (getPath) {
                apiCounts.GET++;
                writes.pipeGET += getPipeEntry(getPath);
                writes.imports += getImportEntry('GET' + apiCounts.GET, fsPath, true);
                writes.constGET += getConstEntry(getPath, 'GET' + apiCounts.GET, 'GET');
            }
            if (postPath) {
                apiCounts.POST++;
                writes.pipePOST += getPipeEntry(postPath);
                writes.imports += getImportEntry('POST' + apiCounts.POST, fsPath, true);
                writes.constPOST += getConstEntry(postPath, 'POST' + apiCounts.POST, 'POST');
            }
        }
    }
}
/** Define the fsPath, fsLayoutPath, and urlPath for each route w/in the provided directory */
async function appInfo(writes, layouts, noLayoutRoutes, dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fsPath = join(dir, entry.name);
        if (entry.isDirectory())
            await appInfo(writes, layouts, noLayoutRoutes, fsPath);
        else if (entry.isFile() && fsPath.endsWith('.tsx')) {
            const content = await readFile(fsPath, 'utf-8');
            const cleanedContent = removeComments(content);
            const match = /export\s+default[\s\S]*?path\s*:\s*(['"`])([^'"`]+)\1/.exec(cleanedContent);
            if (match) { // match[2] is the path for the route
                const urlPath = (match[2] || '').trim();
                const route = { fsPath, urlPath };
                const nameOfLayout = getLayout(cleanedContent);
                writes.pipeRoutes += getPipeEntry(route.urlPath);
                if (nameOfLayout) {
                    const layoutImportPath = getLayoutFrom(cleanedContent, nameOfLayout);
                    if (layoutImportPath) {
                        route.fsLayoutPath = resolve(dirname(fsPath), layoutImportPath);
                        const mapRes = layouts.get(route.fsLayoutPath);
                        if (!mapRes)
                            layouts.set(route.fsLayoutPath, { name: 'layout' + (layouts.size + 1), routes: [route] });
                        else
                            mapRes.routes.push(route);
                        route.moduleName = `route_${layouts.size}_${mapRes ? mapRes.routes.length : 1}`;
                    }
                }
                else {
                    noLayoutRoutes.push(route);
                    route.moduleName = `route_${noLayoutRoutes.length}`;
                }
            }
        }
    }
}
async function write({ env, config, writes, layouts, noLayoutRoutes, baseUrl, dirRead, dirWriteRoot, dirWritePub, pubTypesContent }) {
    const space = '\n';
    await mkdir(dirWriteRoot, { recursive: true });
    await mkdir(dirWritePub, { recursive: true });
    await Promise.all([
        fsWrite({ dir: dirWritePub, content: getApiContent(writes, space), fileName: 'apis.ts' }),
        fsCopy({ dirRead, dirWrite: dirWriteRoot, srcFileName: 'tsconfig.cliBuild.txt', aimFileName: 'tsconfig.json' }),
        fsWrite({ dir: dirWritePub, content: getEnvContent(env, config, baseUrl), fileName: 'env.ts' }),
        fsWrite({ dir: dirWritePub, content: getTypesContent(writes, pubTypesContent), fileName: 'types.d.ts' }),
        fsWrite({ dir: dirWritePub, content: getAppContent(layouts, noLayoutRoutes, space), fileName: 'app.tsx' }),
        privateMods.map(([filename, ext]) => fsCopy({ dirRead, dirWrite: dirWriteRoot, srcFileName: filename + '.txt', aimFileName: filename + '.' + ext, })),
        publicMods.map(([filename, ext]) => fsCopy({ dirRead, dirWrite: dirWritePub, srcFileName: filename + '.txt', aimFileName: filename + '.' + ext, })),
    ]);
    if (!cliVerbose())
        console.log(`✅ Wrote: .solidfun`);
}
async function fsWrite({ dir, content, fileName }) {
    await writeFile(resolve(join(dir, fileName)), content, 'utf8');
    if (cliVerbose())
        console.log('✅ Wrote: ' + join(dir, fileName));
}
async function fsCopy({ dirRead, dirWrite, srcFileName, aimFileName }) {
    await copyFile(join(dirRead, '../../' + srcFileName), join(dirWrite, aimFileName));
    if (cliVerbose())
        console.log('✅ Wrote: ' + join(dirWrite, aimFileName));
}
function getDynamicTypesContent(writes) {
    return `/** Current application routes */
export type Routes = ${!writes.pipeRoutes ? 'string' : writes.pipeRoutes.slice(0, -2)}


/** Current api GET endpoint url paths */
export type GET_Paths = ${!writes.pipeGET ? 'string' : writes.pipeGET.slice(0, -2)}


/** Current api POST endpoint url paths */
export type POST_Paths = ${!writes.pipePOST ? 'string' : writes.pipePOST.slice(0, -2)}\n`;
}
function getTypesContent(writes, pubTypesContent) {
    const index = pubTypesContent.indexOf('/** gen */');
    if (index === -1)
        throw new Error(cliErrors.noGenTypesTxt);
    return pubTypesContent.slice(0, index) + getDynamicTypesContent(writes);
}
function getApiContent(writes, space) {
    return `${writes.imports}${space}
export const gets = {
${writes.constGET.slice(0, -1)}
}
${space}
export const posts = {
${writes.constPOST.slice(0, -1)}
}
`;
}
function getAppContent(layouts, noLayoutRoutes, space) {
    let app = '';
    let imports = '';
    let constRoute = '';
    noLayoutRoutes.forEach(route => {
        imports += getImportEntry(route.moduleName, route.fsPath, false);
        constRoute += getConstEntry(route.urlPath, route.moduleName);
        app += `    <Route path={${route.moduleName}.path} component={${route.moduleName}.component} matchFilters={${route.moduleName}.filters} />\n`;
    });
    layouts.forEach((layout, fsPath) => {
        imports += getImportEntry(layout.name, fsPath, false);
        app += `    <Route component={${layout.name}.component}>\n`;
        layout.routes.forEach(route => {
            imports += getImportEntry(route.moduleName, route.fsPath, false);
            constRoute += getConstEntry(route.urlPath, route.moduleName);
            app += `      <Route path={${route.moduleName}.path} component={${route.moduleName}.component} matchFilters={${route.moduleName}.filters} />\n`;
        });
        app += `    </Route>\n`;
    });
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
${constRoute.slice(0, -2)}
}
${space}
export const App = () => <>
  <Router root={ (props) => <> <MetaProvider> <Suspense>{props.children}</Suspense> </MetaProvider> </> }>
    <FileRoutes />
${app.slice(0, -1)}
  </Router>
</>
`;
}
function getEnvContent(env, config, baseUrl) {
    return `export const env: ${config.envs.map(env => `'${env.name}'`).join(' | ')} = '${env}'
export const url: ${config.envs.map(env => `'${env.url}'`).join(' | ')} = '${baseUrl}'
`;
}
const getImportEntry = (name, fsPath, star) => `import ${star ? '* as ' : ''}${name} from '${fsPath.replace(/\.tsx?$/, '')}'\n`;
const getConstEntry = (urlPath, moduleName, apiModuleName) => `  '${urlPath}': ${moduleName}${apiModuleName ? '.' + apiModuleName : ''},\n`;
const getPipeEntry = (path) => `'${path}' | `;
/**  Get the name the layout is identified as in the route file */
function getLayout(content) {
    const layoutMatch = /layout\s*:\s*([A-Za-z0-9_$]+)/.exec(content);
    return layoutMatch ? layoutMatch[1] : undefined;
}
/** Get import from value based on name of the layout in the file */
function getLayoutFrom(content, identifier) {
    const importRegex = new RegExp(`import\\s+${identifier}\\s+from\\s+(['"])([^'"]+)\\1`);
    const match = importRegex.exec(content);
    return match ? match[2] : undefined;
}
/** Provide the content of a file and if we want the GET or POST path and get it back or null */
function getApiPathFor(exportName, content) {
    const exportRegex = new RegExp(`export const ${exportName}\\s*=`, 'g');
    const match = exportRegex.exec(content);
    if (match) { // export const GET or POST is w/in this content
        const subContent = content.slice(match.index); // find the path *after* the matched export
        const pathMatch = /path\s*:\s*(['"`])([^'"`]+)\1/.exec(subContent);
        return pathMatch ? (pathMatch[2] || '').trim() : null; // the path for the api
    }
    return null;
}
function getEnv() {
    const env = process.argv[3];
    if (!env)
        throw new Error(cliErrors.wrongEnv());
    return env;
}
function getBaseUrl(env, config) {
    let baseUrl;
    for (let configEnv of config.envs) {
        if (env === configEnv.name) {
            baseUrl = configEnv.url;
            break;
        }
    }
    if (!baseUrl)
        throw new Error(cliErrors.wrongEnv(env));
    return baseUrl;
}
function removeComments(code) {
    return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
}
const API_TYPE = {
    GET: 'GET',
    POST: 'POST',
};
