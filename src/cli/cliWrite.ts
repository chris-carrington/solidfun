import path from 'node:path'
import fs from 'node:fs/promises'
import { cliVerbose } from './cliVerbose.js'


export async function cliWrite({ cwd, content, fileName }: { cwd: string, content: string, fileName: string }) {
  const dir = path.join(cwd, '.solid-fun')
  await fs.mkdir(dir, { recursive: true })

  const pathname = path.join(dir, fileName)
  await fs.writeFile(path.resolve(pathname), content, 'utf8')

  if (cliVerbose()) console.log('✅ Wrote: ' + pathname)
}
