
// process configration
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.on('unhandledRejection', err => {
  throw err;
});

import fs from 'fs';
import chalk from 'chalk';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import clearConsole from 'react-dev-utils/clearConsole';
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles';
import { choosePort, createCompiler, prepareProxy, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';
import openBrowser from 'react-dev-utils/openBrowser';

import paths from '../config/paths.js';
import config from '../config/webpack.config.dev.js';
import createDevServerConfig from '../config/webpackDevServer.config.js';

module.exports = () => {
  const useYarn = fs.existsSync(paths.yarnLockFile);
  const isInteractive = process.stdout.isTTY;

  if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
  }

  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  choosePort(HOST, DEFAULT_PORT).then(port => {
    if (port == null) {
      return;
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, HOST, port);
    const compiler = createCompiler(webpack, config, appName, urls, useYarn);
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig,
      config.output.publicPath
    );
    const devServer = new webpackDevServer(compiler, serverConfig);
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });
    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  }).catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  })
}
