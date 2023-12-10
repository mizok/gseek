import { execSync } from 'child_process'
import { matchesAnyInArray } from './tool'
import * as os from 'os'

const IGNORE_TARGETS = ['/HEAD ->', '* ']

export function fuzzySearchBranches(key: string) {
  try {
    const platform = os.platform()
    let command = `git branch -a | Select-String -Pattern "${key}"`
    if (platform === 'linux' || platform === 'darwin') {
      command = `git branch -a | grep '${key}'`
    }
    const results = execSync(command, {
      encoding: 'utf-8',
    })
      .split('\n')
      .map((x) => x.trim())
      .filter((x) => !!x)
      .filter((x) => !matchesAnyInArray(x, IGNORE_TARGETS))

    return results
  } catch (error) {
    return []
  }
}
