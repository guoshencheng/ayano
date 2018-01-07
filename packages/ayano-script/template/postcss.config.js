module.exports = ({ file, options, env }) => ({
  plugins: {
    'postcss-pxtorem': {
      rootValue: 100,
      propWhiteList: [],
    },
    'autoprefixer': {
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ],
    }
  }
})
