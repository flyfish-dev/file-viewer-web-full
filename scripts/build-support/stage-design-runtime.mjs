import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
const records = JSON.parse(await readFile(new URL('./prepared-design-assets.json', import.meta.url)))
export async function stagePreparedDesignRuntime(targetRoot) {
  for (const record of records) {
    const source = new URL('./workspace-inputs/prepared-design/' + record.path, import.meta.url)
    const bytes = await readFile(source)
    assert.equal(bytes.length, record.bytes)
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256)
    const target = resolve(targetRoot, record.path)
    await mkdir(dirname(target), { recursive: true })
    await copyFile(source, target)
    assert.ok(bytes.equals(await readFile(target)))
  }
}
