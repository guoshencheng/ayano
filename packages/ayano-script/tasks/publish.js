import { runCmd } from 'ayano-utils';
var version = require('../package.json').version;
var pubtag = '--ayano-publish'
var chalk = require('chalk');

function getNpmArgs() {
  let npmArgv = null;
  try {
    npmArgv = JSON.parse(process.env.npm_config_argv);
  } catch (err) {
    return null;
  }
  if (typeof npmArgv !== 'object' || !npmArgv.cooked || !Array.isArray(npmArgv.cooked)) {
    return null;
  }
  return npmArgv.cooked;
};


const vaildVersion = (version) => {
  return version.match(/^\d+\.\d+\.\d+$/);
}

function reportError() {
  console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
  console.log(chalk.bgRed('!! `npm publish` is forbidden for this package. !!'));
  console.log(chalk.bgRed('!! Use `npm run pub` instead.        !!'));
  console.log(chalk.bgRed('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
}

function publish(done) {
  let args = ['publish', pubtag];
  var vaild = vaildVersion(version);
  if (!vaild) {
    args = args.concat(['--tag', 'next']);
  }
  console.log(`exec cmd ${args.join(' ')}`)
  const publishNpm = process.env.PUBLISH_NPM_CLI || 'npm';
  runCmd(publishNpm, args, (code) => {
    done(code);
  });
}

function guard(done) {
  var args = process.argv;
  const npmArgs = getNpmArgs();
  if (npmArgs.indexOf(pubtag) < 0) {
    reportError();
    done('use npm run pub instead')
    return;
  } else {
    done();
  }
}

module.exports = (gulp) => {
  gulp.task('pub', (done) => {
    publish(done);
  })
  gulp.task('guard', (done) => {
    guard(done);
  })
};
