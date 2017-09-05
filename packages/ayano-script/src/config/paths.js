import path from 'path';
import fs from 'fs';
import url from 'url';
const appDirectory = process.cwd();
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appDirectory: resolveApp('./'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('dist'),
  appHtml: resolveApp('index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules')
};
