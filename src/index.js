#! /usr/bin/env node

import program from 'commander';
import packageJson from '../package.json';
import chalk from 'chalk';

import init from './scripts/init';
import start from './scripts/start';

program.version(packageJson.version)
program.command('init <name>').action((name) => {
  init(name);
})
program.command('build').action(() => {
  console.log(chalk.red('build'))
})
program.command('publish').action(() => {
  console.log(chalk.red('publish'))
})
program.command('start').action(() => {
  start();
})

program.parse(process.argv);
