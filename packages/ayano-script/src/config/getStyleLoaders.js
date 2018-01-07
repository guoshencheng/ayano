import fs from 'fs';
import paths from './paths';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { readConfig }  from './manager';
const config = readConfig();
const hasPostcssConfig = fs.existsSync(paths.postcssConfigFile);

const cssLoader = {
  loader: "css-loader",
  options: {
    minimize:  process.env.NODE_ENV == 'production'
  }
}

const lessLoader = {
  loader: "less-loader",
  options: {
    modifyVars: config.theme || {}
  }
}

const origin = [
  {
    test: /\.css$/,
    use: [ 'style-loader', cssLoader ]
  },
  {
    test: /\.scss$/,
    use: ["style-loader", cssLoader, "sass-loader"]
  },
  {
    test: /\.less$/,
    use: ["style-loader", cssLoader, lessLoader]
  }
]

const productStyleLoaderItem = (item) => {
  return {
    test: item.test,
    loader: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: item.use.filter(i => i != 'style-loader')
    })
  }
}

export const checkPostcssLoader = (item) => {
  return hasPostcssConfig ? Object.assign({}, item, {
    test: item.test,
    use: item.test.test('a.less') ? item.use.filter(i => i != 'postcss-loader' && i != lessLoader ).concat(['postcss-loader', lessLoader]) : item.use.filter(i => i != 'postcss-loader').concat(['postcss-loader'])
  }) : item;
}

export const common = origin.map(item => {
  return checkPostcssLoader(item);
});

export const mapStyleProduct = (loaders) => {
  const styleTests = origin.map(item => item.test);
  return loaders.map(item => {
    if (styleTests.indexOf(item.test) > -1) {
      return productStyleLoaderItem(checkPostcssLoader(item))
    } else {
      return item;
    }
  })
}
