const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const DIST_DIR = 'dist'
const devDevTool = 'source-map' // see https://webpack.js.org/configuration/devtool/ for options
const prodDevTool = false

var envPresetConfig = {
  modules: false,
  targets: {
    browsers: ['chrome 60'],
  },
}

var plugins = [
  new MiniCSSExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),

  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html'),
  }),
]

module.exports = function (env) {
  var isProd = env && env.production

  if (isProd) plugins.push(new CleanWebpackPlugin())

  return {
    entry: './src/main.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, DIST_DIR),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve('src')],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', envPresetConfig]],
                plugins: [
                  [
                    '@babel/plugin-proposal-decorators',
                    {
                      legacy: false,
                      decoratorsBeforeExport: false,
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCSSExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(sass|scss)$/,
          use: [MiniCSSExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(woff|woff2)$/,
          use: 'url-loader?limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.ttf$/,
          use: 'url-loader?limit=10000&mimetype=application/octet-stream',
        },
        {
          test: /\.eot$/,
          use: 'file-loader',
        },
        {
          test: /\.svg$/,
          use: 'url-loader?limit=10000&mimetype=image/svg+xml',
        },
        {
          test: /^bootstrap\.js$/,
          use: 'imports-loader?jQuery=jquery,$=jquery,Popper=popper.js,this=>window',
        },
      ],
    },
    resolve: {
      symlinks: false,
    },
    plugins: plugins,
    devtool: isProd ? prodDevTool : devDevTool,
  }
}
