// esbuild.config.ts
import { BuildOptions, build } from 'esbuild'
import copyfiles from 'copyfiles'
import { rimraf } from 'rimraf'
import * as os from 'os'
import { exec } from 'child_process'

const config: BuildOptions = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  outfile: 'dist/main.js',
  platform: 'node',
  tsconfig: './tsconfig.json',
}

build(config)
  .then(() => {
    return Promise.all([
      rimraf('./dist/locales'),
      rimraf('./dist/package.json'),
      rimraf('./dist/static'),
    ])
  })
  .then(() => {
    const platform = os.platform()
    copyfiles(['locales/*', 'dist'], { all: false }, () => {
      console.log('Locales files copied successfully!')
    })
    copyfiles(['static/*', 'dist'], { all: false }, () => {
      console.log('static files copied successfully!')
    })
    if (platform === 'linux' || platform === 'darwin') {
      try {
        exec('chmod +x ./dist/main.js', (err, stdout, stderr) => {
          if (err) console.error(err)
        })
      } catch (err) {
        console.error(err)
      }
    }
  })
