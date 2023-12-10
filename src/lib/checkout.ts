import { exec } from 'child_process'
import { echo } from './echo'
import input from '@inquirer/input'
import { isRemoteBranch, isTrackingBranch, testIfGitBranchExist } from './tool'
import { t } from './i18n'

export async function gitCheckout(branch: string) {
  const startWithRemotesPattern = /^remotes\/(.*)/g
  const startWithOriginPattern = /^origin\/(.*)/g
  let targetBranch = branch
  let autoCheckout = true
  let allowCheckout = true
  const branchIsRemoteBranch = isRemoteBranch(branch)
  const branchWithoutRemotesPrefix = branch.replace(
    startWithRemotesPattern,
    `$1`,
  )
  if (branchIsRemoteBranch) {
    //if is remote branch
    // remove remotes prefix first
    if (startWithOriginPattern.test(branchWithoutRemotesPrefix)) {
      //chosen remote is  origin
      targetBranch = branchWithoutRemotesPrefix.replace(
        startWithOriginPattern,
        `$1`,
      )
    } else {
      autoCheckout = false
      //chosen remote is not origin
      echo('you_have_chosen_a_branch_which_is_from_non_origin')
      //輸入想要的追蹤分支名稱 => 驗證是否存在同名分支 => 若否則建立分支，若是則重新輸入
      let trackingBranchName = ''
      try {
        do {
          trackingBranchName = await input({
            message: `${t('name_your_tracking_branch')}`,
          })
        } while (
          !trackingBranchName ||
          (await testIfGitBranchExist(trackingBranchName).then((exist) => {
            if (exist) {
              let banPass = true
              if (trackingBranchName === branchWithoutRemotesPrefix) {
                echo('not_allowed_to_name_the_same_as_remote')
                return banPass
              } else {
                echo('branch_with_the_same_name_already_exists')
              }

              if (
                isTrackingBranch(trackingBranchName, branchWithoutRemotesPrefix)
              ) {
                echo('branch_is_tracking_branch_of_remote_branch', 'green')
                autoCheckout = true
                banPass = false
              } else {
                banPass = true
              }
              return banPass
            }

            return exist
          }))
        )
      } catch (err) {
        allowCheckout = false
        echo('operation_aborted')
      }

      targetBranch = trackingBranchName
    }
  }

  const gitCommand = autoCheckout
    ? `git checkout ${targetBranch}`
    : `git checkout -b ${targetBranch} ${branchWithoutRemotesPrefix}`

  if (allowCheckout) {
    exec(gitCommand, (error, stdout, stderr) => {
      if (!!error) {
        echo('git_checkout_error')
      } else {
        echo(stdout, 'green')
        echo(stderr, 'cyan')
      }
    })
  }
}
