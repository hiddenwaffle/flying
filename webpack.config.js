const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// TODO: Next version of webpack will have this - can remove cross-env (see package.json script).
const env = process.env.NODE_ENV

module.exports = {
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
      template: './js/index.html'
    })
  ]
}
