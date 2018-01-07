import oldConfig from './webpack.config.common';
var manager = require('./manager');
var readConfig = require('./readConfig');
var config = readConfig();
const { webpackConfigBuilder } = config;

module.exports = webpackConfigBuilder(oldConfig);
