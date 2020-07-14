const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const exists = require('exists-sync');
const path = require('path');

const utils = require('./utils.js');

const babelrcPath = path.join(utils.root('.babelrc'));
const babelrcExists = exists(babelrcPath);

const getTsLoaderRule = env => {
  const rules = [
    {
      loader: 'cache-loader',
      options: {
        cacheDirectory: path.resolve('target/cache-loader')
      }
    },
    {
      loader: 'thread-loader',
      options: {
        // there should be 1 cpu for the fork-ts-checker-webpack-plugin
        workers: require('os').cpus().length - 1
      }
    },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        happyPackMode: true
      }
    }
  ];
  if (env === 'development') {
    rules.unshift({
      loader: 'react-hot-loader/webpack'
    });
  }
  return rules;
};

module.exports = options => ({
  cache: options.env !== 'production',
  resolve: {
    extensions: [
      '.js', '.jsx', '.ts', '.tsx', '.json'
    ],
    modules: ['node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      app: utils.root('src/main/webapp/app/')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [utils.getRoot(), /node_modules[\\/](?=@av).*/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [require.resolve('@availity/workflow-babel-preset')],
              cacheDirectory: (process.env.NODE_ENV || 'development') === 'development',
              babelrc: babelrcExists,
              plugins: [babelrcExists ? null : require.resolve('react-hot-loader/babel')]
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: getTsLoaderRule(options.env),
        include: [utils.root('./src/main/webapp/app')],
        exclude: [utils.root('node_modules')]
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
        loader: 'file-loader',
        options: {
          digest: 'hex',
          hash: 'sha512',
          name: 'content/[hash].[ext]'
        }
      },
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        exclude: [utils.root('node_modules')]
      }
    ]
  },
  stats: {
    children: false
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${options.env}'`,
        BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
        VERSION: `'${utils.parseVersion()}'`,
        DEBUG_INFO_ENABLED: options.env === 'development',
        // The root URL for API calls, ending with a '/' - for example: `"https://www.jhipster.tech:8081/myservice/"`.
        // If this URL is left empty (""), then it will be relative to the current context.
        // If you use an API server, in `prod` mode, you will need to enable CORS
        // (see the `jhipster.cors` common JHipster property in the `application-*.yml` configurations)
        SERVER_API_URL: `''`
      }
    }),
    new ForkTsCheckerWebpackPlugin({ tslint: true }),
    new CopyWebpackPlugin([
      { from: './node_modules/swagger-ui-dist/*.{js,css,html,png}', to: 'swagger-ui', flatten: true, ignore: ['index.html']},
      { from: './node_modules/axios/dist/axios.min.js', to: 'swagger-ui'},
      { from: './src/main/webapp//swagger-ui/', to: 'swagger-ui' },
      { from: './src/main/webapp/static/', to: 'content' },
      { from: './src/main/webapp/favicon.ico', to: 'favicon.ico' },
      { from: './src/main/webapp/manifest.webapp', to: 'manifest.webapp' },
      // jhipster-needle-add-assets-to-webpack - JHipster will add/remove third-party resources in this array
      { from: './src/main/webapp/robots.txt', to: 'robots.txt' },
      { from: './src/main/webapp/app/config/env-config.js', to: 'app/env-config.js' }
    ]),
    new HtmlWebpackPlugin({
      template: './src/main/webapp/index.html',
      chunksSortMode: 'dependency',
      inject: 'body'
    }),
    new BaseHrefWebpackPlugin({ baseHref: '/' }),
    new MergeJsonWebpackPlugin({
      output: {
        groupBy: [
          { pattern: "./src/main/webapp/i18n/en/*.json", fileName: "./i18n/en.json" }
          // jhipster-needle-i18n-language-webpack - JHipster will add/remove languages in this array
        ]
      }
    }),
  ]
});
