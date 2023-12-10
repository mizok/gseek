import select, { Separator } from '@inquirer/select'
import rawlist from '@inquirer/rawlist'
import { t } from './i18n'
import chalk, { ColorName } from 'chalk'

export function echo(key: string): void
export function echo(key: string, params: string[]): void
export function echo(key: string, color: ColorName): void
export function echo(key: string, params: string[], color: ColorName): void
export function echo(
  key: string,
  params?: string[] | ColorName,
  color?: ColorName,
): void {
  if (typeof params === 'string') {
    color = params
    params = undefined
  }

  console.log('')
  console.log(chalk[color ?? 'yellow'](t(key, params)))
  console.log('')
}

export const promptUser = async (
  choices: { name: string; value: string }[],
  raw = false,
) => {
  try {
    let selectedBranch = ''
    const sep = '      '
    if (!raw) {
      selectedBranch = await select({
        loop: false,
        message: t('select_a_branch'),
        choices: [new Separator(sep), ...choices, new Separator(sep)],
      })
    } else {
      selectedBranch = await rawlist({
        message: t('select_a_branch'),
        choices: [new Separator(sep), ...choices, new Separator(sep)],
      })
    }

    return selectedBranch
  } catch (error) {
    echo('operation_aborted')
  }
}

export const greeting = (matches: string[]) => {
  console.log('')
  console.log(chalk.bgGreen(t('found_n_results', [matches.length.toString()])))
  echo('press_x_if_you_need_to_abort_operation', ['ctrl+c'])
}
