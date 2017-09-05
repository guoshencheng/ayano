#! /usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json');
const spawn = require('react-dev-utils/crossSpawn');
const chalk = require('chalk');
const cwd = process.cwd();
const fs = require('fs');
const path = require('path');
const { shouldUseYarn, shouldUseCNPM } = require('../lib/utils.js');

const useCNpm = shouldUseCNPM();

const useYarn = shouldUseYarn()

const dependencies = (options) => {
  return ['react', 'react-dom'];
}

const devDependencies = (options) => {
  return ['ayano-script'];
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
    private: true
  }
}

const installDependencies = () => {
  let command, args;
  if (useCNpm) {
    command = 'cnpm';
    args = ['install', '--save'].filter(e => e);
  } else if (useYarn) {
    command = 'yarn';
    args = ['add']
  } else {
    command = 'npm';
    args = ['install', '--save'].filter(e => e);
  }
  args = args.concat(dependencies(), devDependencies());
  console.log(chalk.green(`find command ${command} available`));
  console.log(chalk.green(`exec command ${ command + " " + args.join(" ") }`));
  const proc = spawn.sync(command, args, { stdio: 'inherit' });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    process.exit(1);
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

program.version(packageJson.version)
program.command('init <name>').action((name) => {
  const root = path.resolve(cwd, name);
  createDir(name);
  process.chdir(root);
  const currentPath = process.cwd();
  renderPackageJson(name);
  installDependencies()
  const initScriptPath = path.resolve(currentPath, 'node_modules', 'ayano-script', 'lib/scripts/init.js');
  const init = require(initScriptPath);
  init();
})

program.parse(process.argv);
