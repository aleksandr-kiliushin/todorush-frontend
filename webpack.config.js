const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devServer: {
    historyApiFallback: true,
    port: 3400,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  devtool: 'source-map',
  entry: './src/index.js',
  mode: process.env.MODE,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: ['babel-loader'],
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    sourceMapFilename: '[name].js.map',
  },
  plugins: [
    new webpack.EnvironmentPlugin({ MODE: process.env.MODE }),
    new webpack.SourceMapDevToolPlugin({ filename: '[file].map[query]' }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './' }],
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
}
