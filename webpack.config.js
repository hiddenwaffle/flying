const { DefinePlugin } = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  entry: './js/index.ts',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.[hash].min.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]'
          }
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './js/ui/index.html'
    }),
    new DefinePlugin({
      // TODO: https://github.com/dhis2/settings-app/pull/131
      // Next version of webpack, can remove this and cross-env.
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
    })
  ]
}

if (isProduction) {
  config.plugins.push(new CleanWebpackPlugin())
}

module.exports = config
