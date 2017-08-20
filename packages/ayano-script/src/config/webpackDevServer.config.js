import errorOverlayMiddleware from 'react-error-overlay/middleware';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';
import config from './webpack.dev.config';
import paths from './paths';

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = (proxy, allowedHost, publicPath) => {
 return {
   disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
   compress: true,
   clientLogLevel: 'none',
   contentBase: paths.appDirectory,
   watchContentBase: true,
   hot: true, publicPath,
   quiet: true,
   watchOptions: {
     ignored: /node_modules/,
   },
   https: protocol === 'https',
   host: host,
   overlay: false,
   historyApiFallback: {
     disableDotRule: true,
   },
   public: allowedHost,
   proxy,
   setup(app) {
     app.use(errorOverlayMiddleware());
     app.use(noopServiceWorkerMiddleware());
   },
 };
};
