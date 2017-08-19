#! /usr/bin/env node

import program from 'commander';
import packageJson from '../package.json';
import chalk from 'chalk';

import init from './scripts/init';

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
  console.log(chalk.red('start'))
})

program.parse(process.argv);
