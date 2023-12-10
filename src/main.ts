#!/usr/bin/env node

import { program } from 'commander'
import { execSync } from 'child_process'
import { fuzzySearchBranches } from './lib/fuzzy'
import { echo, greeting, promptUser } from './lib/echo'
import { isGitRepo } from './lib/tool'
import { initI18n } from './lib/i18n'
import { gitCheckout } from './lib/checkout'
import fs from 'fs'
import path from 'path'

async function userInputHandler(input: string, option: { raw: boolean }) {
  const isGitRepository = await isGitRepo()
  let currentBranch = ''
  if (isGitRepository) {
    currentBranch = execSync('git branch --show-current HEAD', {
      encoding: 'utf-8',
    }).trim()
  } else {
    return echo('this_folder_is_not_a git_repository')
  }
  if (!input) {
    return echo('input_is_needed')
  }
  const matches = fuzzySearchBranches(input)
  if (matches.length > 0) {
    greeting(matches)
    const selectedBranch = await promptUser(
      matches.map((x) => ({
        name: x,
        value: x,
      })),
      option.raw,
    )

    if (selectedBranch) {
      gitCheckout(selectedBranch)
    }
  } else {
    echo('no_matched_results')
  }
}

async function boot() {
  // init i18n
  await initI18n()
  //init program
  const packageJsonPath = path.resolve(__dirname, 'package.json')
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonContent)

  const version = packageJson.version
  const description = packageJson.description
  program.version(version).description(description)
  program
    .option('-r, --raw', 'Show search results in a numbered raw list.')
    .arguments('[input]')
    .action(userInputHandler)

  program.parse(process.argv)
}

boot()
