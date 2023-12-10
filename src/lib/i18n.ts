import i18next, { ResourceLanguage } from 'i18next'
import { promises } from 'fs'
import * as path from 'path'

export async function initI18n() {
  const RELATIVE_LOCALES_FOLDER_PATH = './locales'
  const LOCALES_PATH = path.join(__dirname, RELATIVE_LOCALES_FOLDER_PATH)
  const localesFiles: Record<string, { translation: ResourceLanguage }> =
    await promises
      .readdir(LOCALES_PATH)
      .then((files = []) => {
        return files.reduce((acc, next) => {
          const basename = path.parse(path.basename(next)).name
          const extname = path.extname(next).toLowerCase()
          const targetFileTypeExtName = '.json'
          if (extname === targetFileTypeExtName) {
            acc[basename] = {
              translation: require(path.join(LOCALES_PATH, next)),
            }
          }
          return acc
        }, {} as Record<string, { translation: ResourceLanguage }>)
      })
      .catch((err) => {
        if (err.code === 'ENOENT') {
          console.error('Locale folder does not exist. Creating the folder...')
        } else {
          console.error('Error reading folder:', err)
        }
        return {}
      })

  i18next.init({
    lng: 'en',
    resources: localesFiles,
  })
  const currentLanguage = (process.env.LANG || 'en_US.UTF-8').split('.')[0]
  const supportedLanguages = Object.keys(localesFiles)
  if (supportedLanguages.includes(currentLanguage)) {
    i18next.changeLanguage(currentLanguage)
  }
}

export let t = (key: string, options: string[] = []) => {
  const mappedOption = options.reduce((acc, next, index) => {
    acc[`$${index}`] = next
    return acc
  }, {} as Record<string, string>)
  const translated = i18next.t(key, mappedOption) ?? key
  return translated
}
