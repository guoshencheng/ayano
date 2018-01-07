import oldConfig from './webpack.config.common';
var readConfig = require('./readConfig').default;
var config = readConfig();
const { webpackConfigBuilder } = config;

module.exports = webpackConfigBuilder(oldConfig);
