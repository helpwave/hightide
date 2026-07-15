const { execSync } = require('node:child_process')

module.exports = () => {
  execSync('pnpm --filter @helpwave/hightide-utils run build-intl', {
    stdio: 'inherit',
  })
}
