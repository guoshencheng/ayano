import paths from './paths';
import fs from 'fs';
import path from 'path';
const configFile = paths.configFile;

const defaultWebpackConfigBuilder = old => old;


/**
 * entry
 * output
 * externals
 * extensions
 * theme
 * resourcePrefix
 * resourceDescribeFileName
 * webpackConfigBuilder
 * upload
 * publish
 * defineValue
 */
const defaultConfig = {
  entry: './src/index.js',
  output: './public/dist',
  externals: {
    react: 'React', 'react-dom': 'ReactDOM',
  },
  extensions: ['.jsx', '.js', '.json'],
  resourceDescribeFileName: 'resources.json',
  webpackConfigBuilder: defaultWebpackConfigBuilder,
}

export default () => {
  if (fs.existsSync(configFile)) {
    var config = require(configFile);
    return Object.assign({}, defaultConfig, config);
  } else {
    return defaultConfig;
  }
}
