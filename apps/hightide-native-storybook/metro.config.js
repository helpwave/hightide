const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { resolve: metroResolve } = require('metro-resolver')
const { withStorybook } = require('@storybook/react-native/withStorybook')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const projectNodeModules = path.resolve(projectRoot, 'node_modules')
const workspaceNodeModules = path.resolve(workspaceRoot, 'node_modules')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]

config.resolver.nodeModulesPaths = [
  projectNodeModules,
  workspaceNodeModules,
]

const singletonPackages = [
  'react',
  'react-native',
  'react-native-svg',
  'lucide-react-native',
]

const isSingletonModule = (moduleName) =>
  singletonPackages.some(
    (pkg) => moduleName === pkg || moduleName.startsWith(`${pkg}/`)
  )


config.resolver.extraNodeModules = {
  'react': path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react-native-svg': path.resolve(projectRoot, 'node_modules/react-native-svg'),
  'lucide-react-native': path.resolve(projectRoot, 'node_modules/lucide-react-native'),
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (isSingletonModule(moduleName)) {
    return {
      filePath: require.resolve(moduleName, { paths: [projectRoot] }),
      type: 'sourceFile',
    }
  }

  return metroResolve(
    {
      ...context,
      resolveRequest: undefined,
    },
    moduleName,
    platform
  )
}

module.exports = withStorybook(config)
