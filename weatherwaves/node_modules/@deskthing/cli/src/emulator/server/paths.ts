import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

export function getDirname(importMetaUrl: string): string {
  const __filename = fileURLToPath(importMetaUrl)
  return dirname(__filename)
}

export function resolveRoot(...paths: string[]): string {
  return resolve(getDirname(import.meta.url), '../../..', ...paths)
}

export function resolveConfig(configName: string): string {
  return resolve(getDirname(import.meta.url), '../config', configName)
}
