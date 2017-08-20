var webpack = require('webpack')
var path = require('path')
var fs = require('fs')
var base = require('./webpack.config.dev.js');
var pxtorem = require('postcss-pxtorem');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var SakuraWebpackPlugin = require('sakura-webpack-plugin');
var production = Object.assign({}, base);

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

var cssLoader = {
  loader: "css-loader",
  options: {
    minimize: true
  }
}

production.entry = Object.keys(base.entry).reduce((pre, cur) => {
  const obj = base.entry[cur];
  if (Array.isArray(obj)) {
    return Object.assign(pre, { [cur]: obj.filter((v) => v != "webpack-hot-middleware/client") })
  } else {
    return Object.assign(pre, { [cur]: obj })
  }
}, {});

production.output = {
  path: path.resolve(__dirname, './public/dist'),
  filename: "[name].[hash].js",
}

production.module.loaders = base.module.loaders.map((value) => {
  if ( value.test.test("a.scss")) {
    return {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [cssLoader, "sass-loader", postcssLoader]
      })
    }
  } else if ( value.test.test("a.css") ) {
    return {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [cssLoader, postcssLoader]
      })
     };
  } else {
    return value;
  }
})

production.plugins = [
  new SakuraWebpackPlugin({
    prefix: "http://yourhost/",
    single: true
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
  }),
]

production.devtool = "";

module.exports = production;
