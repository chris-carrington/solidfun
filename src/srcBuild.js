#!/usr/bin/env node
// @ts-check

import { join } from 'node:path'
import { mkdir, copyFile } from 'node:fs/promises'
import { fundamentals, fundamentalHelpers } from './fundamentals.js'

try {
  const cwd = process.cwd()
  const distDir = join(cwd, 'dist')

  await mkdir(distDir, { recursive: true })

  await Promise.all([ // create txt files
    copyFile(join(cwd, 'src/index.ts'), join(distDir, `index.d.ts`)), // ts does not show errors in .d.ts files so we start w/o it to get intellisense & then use it to inform ts, only declarations in here
    copyFile(join(cwd, 'src/pub/types.ts'), join(distDir, `types.d.txt`)),
    copyFile(join(cwd, 'tsconfig.cliBuild.json'), join(distDir, `tsconfig.cliBuild.txt`)),
    ...fundamentalHelpers.map(([name, ext]) => copyFile(join(cwd, 'src', `${name}.${ext}`), join(distDir, `${name}.txt`))),
    ...fundamentals.map(([name, ext]) => copyFile(join(cwd, 'src/pub', `${name}.${ext}`), join(distDir, `${name}.txt`))),
  ])

  console.log('✅ Built Solid Fun!')
} catch (e) {
  console.error('❌ srcBuild:', e)
}
