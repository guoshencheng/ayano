#! /usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json');
const spawn = require('react-dev-utils/crossSpawn');
const chalk = require('chalk');
const cwd = process.cwd();
const fs = require('fs');
const path = require('path');
const { shouldUseCNPM, shouldUseYarn, npmInstallTag } = require('ayano-utils/dist/version.js');

const useCNpm = shouldUseCNPM();

const useYarn = shouldUseYarn()

const dependencies = (options) => {
  return ['react', 'react-dom'];
}

const devDependencies = ({ tag }) => {
  return [ npmInstallTag(packageJson)('ayano-script')(tag)];
}

const renderPackageJson = (name, options) => {
  const pacakageJson = buildPackageJson(name, options);
  var fileString = JSON.stringify(pacakageJson, null, 2);
  fs.writeFileSync(path.resolve(cwd, "./" + name + "/package.json"), fileString)
}

const buildPackageJson = (name, options) => {
  return {
    name,
    version: '1.0.0',
    private: true
  }
}

const installDependencies = ({ forceNpm, tag }) => {
  let command, args;
  if (useCNpm && !forceNpm) {
    command = 'cnpm';
    args = ['install', '--save'].filter(e => e);
  } else if (useYarn && !forceNpm) {
    command = 'yarn';
    args = ['add']
  } else {
    command = 'npm';
    args = ['install', '--save'].filter(e => e);
  }
  args = args.concat(dependencies(), devDependencies({ tag }));
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
program.command('init <name>')
  .option('-t, --tag [tag]', 'install mum-script with tag')
  .option('-n, --npm', 'force use npm')
  .action((name, options) => {
    const root = path.resolve(cwd, name);
    const tag = options.tag;
    const forceNpm = options.npm;
    createDir(name);
    process.chdir(root);
    const currentPath = process.cwd();
    renderPackageJson(name);
    installDependencies({ forceNpm, tag })
    const initScriptPath = path.resolve(currentPath, 'node_modules', 'ayano-script', 'lib/scripts/init.js');
    const init = require(initScriptPath);
    init({ tag });
})

program.parse(process.argv);
