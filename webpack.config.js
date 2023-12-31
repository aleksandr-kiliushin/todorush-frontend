const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const path = require('path')
require('dotenv').config({ path: './.env' })
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devServer: {
    historyApiFallback: true,
    port: 3400,
  },
  devtool: 'source-map',
  entry: './src/index.tsx',
  mode: process.env.MODE,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(ts|tsx)$/,
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
    new webpack.EnvironmentPlugin({
      API_BASE_URL: process.env.API_BASE_URL,
      MODE: process.env.MODE,
    }),
    new webpack.SourceMapDevToolPlugin({ filename: '[file].map[query]' }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './' }],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, './tsconfig.json'),
      }),
    ],
  },
}
