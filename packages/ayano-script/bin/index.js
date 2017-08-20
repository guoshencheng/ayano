#! /usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json');
const chalk = require('chalk');

const init = require('../lib/scripts/init');
const start = require('../lib/scripts/start');
const build = require('../lib/scripts/build');

program.version(packageJson.version)
program.command('init').action((name) => {
  init(name);
})
program.command('build').action(() => {
  build()
})
program.command('publish').action(() => {
  console.log(chalk.red('publish'))
})
program.command('start').action(() => {
  start();
})

program.parse(process.argv);
