const cwd = process.cwd();
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
const spawn = require('react-dev-utils/crossSpawn');
import { shouldUseYarn } from '../utls.js';
const useYarn = shouldUseYarn();

const dependencies = (options) => {
  return ['react', 'react-dom'];
}

const devDependencies = (options) => {
  return ['ayano'];
}

const buildScripts = (optsion) => {
  return {
    start: 'ayano start',
    build: 'ayano build',
  }
}

const createDir = (name, options) => {
  try {
    fs.mkdirSync(path.resolve(cwd, "./" + name))
    console.log('Creating a new ayano app in ' + chalk.green((path.resolve(cwd, "./" + name) + " !")));
  } catch( error ) {
    if (error.code == "EEXIST") {
      console.log(chalk.red(` A directory named ${name} has been exist`))
    } else {
      console.log(error.code, error.message);
    }
    process.exit(1);
  }
}

const renderPackageJson = (name, options) => {
  const pacakageJson = buildPackageJson(name, options);
  var fileString = JSON.stringify(pacakageJson, null, 2);
  fs.writeFileSync(path.resolve(cwd, "./" + name + "/package.json"), fileString)
}

const buildPackageJson = (name, options) => {
  return {
    name,
    version: '0.1.0',
    private: true,
    scripts: buildScripts(options)
  }
}

const installDependencies = () => {
  let command, args;
  if (useYarn) {
    command = 'yarn';
    args = ['add']
  } else {
    command = 'npm';
    args = ['install', '--save', '--verbose'].filter(e => e);
  }
  args = args.concat(dependencies());
  const proc = spawn.sync(command, args, { stdio: 'inherit' });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    process.exit(1);
  }
}

const copyTemplate = (target) => {
  const templatePath = path.resolve(__dirname, '../../template')
  fs.copySync(templatePath, target);
}

module.exports = (name, options) => {
  const root = path.resolve(cwd, name);
  createDir(name, options);
  renderPackageJson(name, options);
  process.chdir(root);
  const currentPath = process.cwd();
  installDependencies();
  copyTemplate(currentPath);
};
