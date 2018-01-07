process.env.SASS_BINARY_SITE = "https://npm.taobao.org/mirrors/node-sass"

import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import packageJson from '../../package.json';
const spawn = require('react-dev-utils/crossSpawn');
import { shouldUseYarn, shouldUseCNPM } from '../utls.js';
import { version } from 'ayano-utiles';
const useYarn = shouldUseYarn();
const useCNpm = shouldUseCNPM();
const { npmInstallTag } = version;

const buildScripts = () => ({
  start: 'ayano-script start',
  build: 'ayano-script build',
  publish: "ayano-script publish -m 'upload new version'",
  upload: "ayano-script upload"
})

const changePackageJson = (cwd) => {
  const packageJsonPath = path.join(cwd, 'package.json');
  const origin = require(packageJsonPath);
  const target = Object.assign({}, origin, {
    scripts: buildScripts(),
  })
  fs.writeFileSync(packageJsonPath, JSON.stringify(target, null, 2))
  console.log(target)
}

const copyTemplate = (target) => {
  const templatePath = path.resolve(__dirname, '../../template')
  fs.copySync(templatePath, target);
}

const mumReactKey = 'mum-react';
const mumComonentsKey = 'mum-components';
const dependencies = ({ tag }) => {
  let deps = [];
  deps = deps.concat(npmInstallTag(packageJson)('ayano-react')(tag));
  return deps;
}

const devDependencies = () => {
  return [].concat(cssloaders()).concat(postcssPlugins());
}

const cssloaders = () => {
  const loaders = ['less', 'less-loader'];
  console.log(chalk.green(`using loaders ${loaders.join(' ')}`))
  return loaders;
}

const postcssPlugins = () => {
  const plugins = ['postcss-pxtorem', 'autoprefixer'];
  console.log(chalk.green(`using postcss plugins ${plugins.join(' ')}`))
  return plugins;
}

const install = (deps, options = {}) => {
  const { npm, dev } = options;
  let command, args;
  const saveOption = dev ? '--save-dev' : '--save'
  if (useCNpm && !npm) {
    command = 'cnpm';
    args = ['install', '--by=npm', saveOption ].filter(e => e);
  // } else if (useYarn) {
  //   command = 'yarn';
  //   args = ['add', '--dev']
  } else {
    command = 'npm';
    args = ['install', saveOption].filter(e => e);
  }
  args = args.concat(deps);
  console.log(chalk.green(`find command ${command} available`));
  console.log(chalk.green(`exec command ${ command + " " + args.join(" ") }`));
  const proc = spawn.sync(command, args, {
    stdio: 'inherit',
    env: process.env,
  });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    process.exit(1);
  }
}

const installDevDependencies = ({ tag }) => {
  install(devDependencies({ tag }), { npm: options.npm, dev: true });
}


const installDependencies = ({ tag }) => {
  install(dependencies({ tag }), { npm: options.npm, dev: false });
}

module.exports = ({ tag }) => {
  const cwd = process.cwd();
  changePackageJson(cwd)
  copyTemplate(cwd);
  installDependencies({ tag });
  installDevDependencies({ tag });
};
