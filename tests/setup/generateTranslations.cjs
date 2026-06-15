const { execSync } = require('node:child_process')

module.exports = () => {
  execSync('npx build-intl --force -i ./locales -o ./src/i18n/translations.ts -n hightideTranslation', {
    stdio: 'inherit',
  })
}
