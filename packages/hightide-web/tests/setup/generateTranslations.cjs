const { execSync } = require('node:child_process')
const path = require('node:path')

module.exports = () => {
  const utilsRoot = path.resolve(__dirname, '../../../hightide-utils')
  execSync('npm run build-intl', {
    cwd: utilsRoot,
    stdio: 'inherit',
  })
}
