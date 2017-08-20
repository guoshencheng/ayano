import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
const spawn = require('react-dev-utils/crossSpawn');
import { shouldUseYarn } from '../utls.js';
const useYarn = shouldUseYarn();

const buildScripts = () => ({
  start: 'ayano-script start',
  build: 'ayano-script build',
  publish: 'ayano-script publish'
})

const changePackageJson = (cwd) => {
  const packageJsonPath = path.join(cwd, 'package.json');
  const origin = require(packageJsonPath);
  const target = Object.assign({}, origin, {
    scripts: buildScripts()
  })
  fs.writeFileSync(packageJsonPath, JSON.stringify(target, null, 2))
  console.log(target)
}

const copyTemplate = (target) => {
  const templatePath = path.resolve(__dirname, '../../template')
  fs.copySync(templatePath, target);
}

module.exports = (options) => {
  const cwd = process.cwd();
  changePackageJson(cwd)
  copyTemplate(cwd);
};
