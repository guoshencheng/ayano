#! /usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json');
const chalk = require('chalk');
const cwd = process.cwd();

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
  createDir(name);
  process.chdir(root);
  const currentPath = process.cwd();
})

program.parse(process.argv);
