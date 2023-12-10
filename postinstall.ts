import * as fs from 'fs'

// 讀取 package.json 文件
const packageJsonPath = './package.json'
const packageJson = require(packageJsonPath)

// 執行 npx husky install
const { execSync } = require('child_process')
execSync('npx husky install')

// 刪除 scripts 中的 postinstall
delete packageJson.scripts.postinstall

// 將修改後的 package.json 儲存回文件
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log(
  'postinstall is complete, npx husky install has been executed and the postinstall directive has been deleted. ',
)

// 刪除 postinstall.ts 檔案自身
const currentScriptPath = './postinstall.ts'
fs.unlinkSync(currentScriptPath)

console.log('postinstall.ts file has been deleted.')
