import { exec, execSync } from 'child_process'
import simpleGit from 'simple-git'

export const isGitRepo = async () => {
  try {
    const git = simpleGit(process.cwd())
    return await git.checkIsRepo()
  } catch (error) {
    return false
  }
}

export function matchesAnyInArray(str: string, arr: string[]): boolean {
  return arr.reduce((isSomethingInArrayMatched, nextStringInArray) => {
    if (str.indexOf(nextStringInArray) > -1) {
      isSomethingInArrayMatched = true
    }
    return isSomethingInArrayMatched
  }, false)
}

export function testIfGitBranchExist(branchName: string): Promise<boolean> {
  let res: (param: boolean) => void
  const pm = new Promise<boolean>((_res) => {
    res = _res
  })
  exec(`git rev-parse --verify ${branchName}`, (err, stdout, stderr) => {
    if (!err) {
      res(true)
    } else {
      res(false)
    }
  })
  return pm
}

export function isTrackingBranch(localBranch: string, remoteBranch: string) {
  try {
    // 執行 git 指令以取得遠端分支的追蹤分支訊息
    const output = execSync(
      `git rev-parse --abbrev-ref --symbolic-full-name ${localBranch}@{upstream}`,
      { encoding: 'utf-8' },
    )
    return remoteBranch.includes(output.trim())
  } catch (error) {
    // 處理錯誤，例如分支不存在等情況
    return false
  }
}

export function isRemoteBranch(remoteBranchName: string) {
  try {
    // 執行 git 指令以取得遠端分支列表
    const output = execSync('git branch -r', { encoding: 'utf-8' })

    // 檢查輸出是否包含指定的遠端分支
    const remoteBranches = output
      .trim()
      .split('\n')
      .filter((o) => !matchesAnyInArray(o, ['/HEAD', ' -> ']))
      .map((branch) => 'remotes/' + branch.trim())
    return remoteBranches.includes(`${remoteBranchName}`)
  } catch (error) {
    // 處理錯誤，例如 Git 指令執行失敗等情況
    return false
  }
}
