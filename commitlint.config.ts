import { UserConfig } from '@commitlint/types'

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  // 定義 Commitlint 規則
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test'],
    ],
    'scope-empty': [2, 'always'],
    'scope-enum': [
      2,
      'always',
      ['core', 'ui', 'config', 'build', 'docs', 'chore', 'test'],
    ],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
  },
  'parser-preset': {
    // 自定義 commit 訊息解析器（如果需要的話）
    'parser-opts': {
      'issue-prefixes': ['#'], // 定義 issue 號碼的前綴符號
    },
  },
}

export default config
