const path = require('path');
const webpack = require('webpack')
const {CheckerPlugin} = require('awesome-typescript-loader')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  target: 'web',
  entry: path.resolve(__dirname, 'src/howerest.sdkzer.ts'),
  output: {
    filename: `howerest.sdkzer.js`,
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: true
      }
    })
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  // js-webservice is used but not bundled with Sdkzer. This has to be imported
  // in the sdk you create using Sdkzer
  externals: /^(js-webservices|\$)$/i,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: []
      }
    ]
  },
  plugins: [
      new CheckerPlugin(),
      new webpack.BannerPlugin({
        banner: "sdkzer 1.6.0 - By David Valin - www.davidvalin.com",
        entryOnly: true
    })
  ]
};
