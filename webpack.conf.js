const path = require('path');
const webpack = require('webpack')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: path.resolve(__dirname, 'src/howerest.sdkzer.ts'),
  output: {
    filename: `howerest.sdkzer.js`,
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    umdNamedDefine: false,
    globalObject: 'this'
  },
  plugins: [
    // new UglifyJsPlugin({
    //   uglifyOptions: {
    //     compress: false
    //   }
    // })
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    // new CheckerPlugin(),
    new webpack.BannerPlugin({
      banner: "sdkzer 0.8.3 - By David Valin - www.davidvalin.com",
      entryOnly: true
    })
  ]
};
