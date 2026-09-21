import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const tagPrefix = process.env.TAG_PREFIX
const packageDir = process.env.PACKAGE_DIR
const tagName = process.env.TAG_NAME ?? process.env.GITHUB_REF_NAME

if (!tagPrefix || !packageDir || !tagName) {
  console.error("TAG_PREFIX, PACKAGE_DIR, and TAG_NAME (or GITHUB_REF_NAME) are required")
  process.exit(1)
}

const expectedPrefix = `${tagPrefix}@`

if (!tagName.startsWith(expectedPrefix)) {
  console.error(`Tag "${tagName}" does not match "${tagPrefix}@<version>"`)
  process.exit(1)
}

const tagVersion = tagName.slice(expectedPrefix.length)

if (!tagVersion) {
  console.error(`Tag "${tagName}" is missing a version`)
  process.exit(1)
}

const packageJsonPath = resolve(packageDir, "package.json")
const { name, version } = JSON.parse(readFileSync(packageJsonPath, "utf8"))

if (version !== tagVersion) {
  console.error(
    `Tag version "${tagVersion}" does not match ${packageJsonPath} version "${version}" (${name})`,
  )
  process.exit(1)
}

const changelogPath = resolve(packageDir, "CHANGELOG.md")
const changelog = readFileSync(changelogPath, "utf8")
const escapedVersion = tagVersion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const changelogHeading = new RegExp(`^## \\[${escapedVersion}\\](?:\\s|$)`, "m")

if (!changelogHeading.test(changelog)) {
  console.error(`${changelogPath} has no Keep a Changelog heading for version ${tagVersion}`)
  process.exit(1)
}

console.log(`Publish precheck passed for ${tagName} (${name}@${version})`)
