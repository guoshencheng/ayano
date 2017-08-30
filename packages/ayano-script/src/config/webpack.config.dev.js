import webpack from 'webpack';
import path from 'path';
import pxtorem from 'postcss-pxtorem';
import paths from './paths.js';

const babelPlugin = [["import", [{ "style": "css", "libraryName": "antd-mobile" }]]];
const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
];

var postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcss: {},
    plugins: (loader) => [
      pxtorem({
        rootValue: 100,
        propWhiteList: [], // don't use propList.
      })
    ]
  }
}

module.exports = {
  entry: {
    main: [
      require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.appIndexJs
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
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: babelPlugin
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
