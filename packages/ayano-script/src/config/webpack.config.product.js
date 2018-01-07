import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import SakuraWebpackPlugin from 'sakura-webpack-plugin';
import base from './webpack.config.common';
import { mapStyleProduct } from './getStyleLoaders';
import readConfig from './readConfig';
import getDefineValue from './getDefineValue';

var production = Object.assign({}, base);
var config = readConfig();
var defineValue = getDefineValue();

var cssLoader = {
  loader: "css-loader",
  options: {
    minimize: true
  }
}

production.entry = Object.keys(base.entry).reduce((pre, cur) => {
  const obj = base.entry[cur];
  if (Array.isArray(obj)) {
    return Object.assign(pre, { [cur]: obj.filter((v, index) => index != 0) })
  } else {
    return Object.assign(pre, { [cur]: obj })
  }
}, {});

production.output = Object.assign({}, base.output, {
  filename: "[name].[hash].js",
})

production.module.loaders = mapStyleProduct(base.module.loaders);

production.plugins = [
  new SakuraWebpackPlugin({
    prefix: config.resourcePrefix,
    single: true,
    resourceFileName: config.resourceDescribeFileName
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new ExtractTextPlugin('[name].[hash].css'),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
    DEFINE_VALUE: defineValue
  }),
]

production.devtool = "";

const { webpackConfigBuilder } = config;

module.exports = webpackConfigBuilder(production);
