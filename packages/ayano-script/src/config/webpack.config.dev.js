const webpack = require('webpack');
const path = require('path');
const pxtorem = require('postcss-pxtorem');
const paths = require('./paths.js');
const appDirectory = process.cwd();
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appIndexJs = resolveApp('src/index.js');
const appPackageJson = resolveApp('package.json');

var packageJson;
try {
  packageJson = require(appPackageJson) || {};
} catch (e) {
}

var ayanoConfig = packageJson['ayano-config'] || {};
var disablePx2Rem = ayanoConfig['disablePx2Rem'];

const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
];

var postcssPlugins = [];

if (!disablePx2Rem) {
  postcssPlugins = postcssPlugins.concat([pxtorem({
    rootValue: 100,
    propWhiteList: [], // don't use propList.
  })])
}

var postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcss: {},
    plugins: (loader) => postcssPlugins
  }
}

module.exports = {
  entry: {
    main: [
      require.resolve('react-dev-utils/webpackHotDevClient'),
      appIndexJs
    ]
  },
  resolve: {
    extensions: ['.web.js', '.js', '.json'],
  },
  output: {
    path: path.resolve(__dirname, './public/dist'),
    filename: "[name].js",
    publicPath: "/dist/"
  },
  externals:{
    react: 'React',
    'react-dom': 'ReactDOM',
    'TWEEN': 'TWEEN',
    moment: "moment",
    axios: "axios",
    dd: "dd"
  },
  module: {
    loaders: [
       {
        test: /\.(png|svg)$/i,
        loader: 'svg-sprite-loader',
        include: svgDirs,
      },
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader', postcssLoader]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader", postcssLoader]
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
        exclude: svgDirs
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name]-[hash].[ext]'
      }
    ]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  devtool: 'source-map'
}
