// Global imports
var webpack = require('webpack'),
  path = require('path'),
  CopyWebpackPlugin = require('copy-webpack-plugin');

// Paths
var entry = './game.js',
  includePath = path.join(__dirname, 'src'),
  nodeModulesPath = path.join(__dirname, 'node_modules'),
  copyRes = [
    'game.json',
    'project.config.json',
    'res/*'
  ]

// Environment
var PROD = JSON.parse(process.env.NODE_ENV || 0);

// Dev environment
var env = 'dev',
  time = Date.now(),
  devtool = 'source-map',
  mode = 'development',
  stats = 'minimal',
  plugins = [
    //new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(env),
      ___BUILD_TIME___: time
    }),
    new CopyWebpackPlugin(copyRes)
  ];

// Production environment
if (PROD) {
  env = 'prod';
  devtool = 'hidden-source-map';
  mode = 'production';
  stats = 'none';
}

module.exports = {
  // Here the application starts executing
  // and webpack starts bundling
  entry: [
    entry
  ],

  output: {
    filename: 'game.js'
  },

  mode: mode,

  // configuration regarding modules
  module: {
    // rules for modules (configure loaders, parser options, etc.)
    rules: [
      {
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preference over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include
        test: /\.js?$/,
        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide
        use: {
          loader: 'babel-loader',
        },
        include: includePath,
        exclude: nodeModulesPath,
      }
    ]
  },

  // options for resolving module requests
  // (does not apply to resolving to loaders)
  resolve: {
    alias:{
      three: path.resolve(__dirname, './lib/three.js')
    },

    // directories where to look for modules,
    modules: [
      'node_modules',
      path.resolve(__dirname, 'lib')
    ],

    // extensions that are used
    extensions: ['.js', '.json', '.css'],
  },

  performance: {
    hints: 'warning' // enum
  },

  // lets you precisely control what bundle information gets displayed
  stats: stats,

  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  devtool: devtool, // enum

  devServer: {
    contentBase: 'src/public'
  },

  plugins: plugins
};
