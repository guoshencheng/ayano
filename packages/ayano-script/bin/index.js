#! /usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const init = require('../lib/scripts/init');
const start = require('../lib/scripts/start');
const build = require('../lib/scripts/build');
const publish = require('../lib/scripts/publish');
const gulp = require('gulp');
require('../gulpfile.js');

program.version(packageJson.version);

program.command('init')
.option('-npm, --npm', 'force use npm').action((options) => {
  init({ npm: options.npm });
})

program.command('build')
.option('-c, --config [config]', "webpack config file path").action((command) => {
  const { config } = command;
  if (config) {
    const cwd = process.cwd();
    let configPath = path.resolve(cwd, config);
    if (!fs.existsSync(configPath)) {
      configPath = void 6;
      console.log(chalk.red(`config file at ${config} is not exist! use default config!`))
    } else {
      console.log(chalk.green(`use config file at ${config} !`))
    }
    build(configPath)
  } else {
    build();
  }
})

program.command('publish')
.option('-m, --comment [comment]')
.action((command) => {
  const { comment } = command;
  if (Object.prototype.toString.call(comment) == '[object String]') {
    publish(comment);
  } else {
    console.log(chalk.red('MISS PARAMS:') + " -m or --comment is required")
  }
})

program.command('start')
.option('-c, --config [config]', "webpack config file path").action((command) => {
  const { config } = command;
  if (config) {
    const cwd = process.cwd();
    let configPath = path.resolve(cwd, config);
    if (!fs.existsSync(configPath)) {
      configPath = void 6;
      console.log(chalk.red(`config file at ${config} is not exist! use default config!`))
    } else {
      console.log(chalk.green(`use config file at ${config} !`))
    }
    start(configPath);
  } else {
    start();
  }
})

program.command('upload').action(command => {
  gulp.start('upload');
})

program.parse(process.argv);
