const webpack = require('webpack');
const path = require('path');
const paths = require('./paths.js');
import readConfig from './readConfig';
import { common } from './getStyleLoaders';
import getDefineValue from './getDefineValue';
const appDirectory = process.cwd();
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

var config = readConfig();
const defineValue = getDefineValue();
const appIndexJs = resolveApp(config.entry);
const output = resolveApp(config.output);

var cssLoader = {
  loader: "css-loader",
  options: {
    minimize:  process.env.NODE_ENV == 'production'
  }
}

module.exports = {
  entry: {
    main: [
      // 'webpack-hot-middleware/client?timeout=2000&reload=true',
      require.resolve('react-hot-loader/patch'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
      appIndexJs
    ]
  },
  resolve: {
    extensions: config.extensions,
  },
  output: {
    path: output,
    filename: "[name].js",
    publicPath: "/"
  },
  externals: config.externals,
  module: {
    loaders: common.concat([
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "images/[name]-[hash].[ext]",
          },
        }],
      }
    ])
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
      DEFINE_VALUE: defineValue
    }),
  ],
  devtool: 'source-map'
}
