const path = require('path')
module.exports = {
  entry: [
    './test-browser/setup.js',
    './test-browser/run.js'
  ],
  output: {
    path: path.resolve(__dirname),
    filename: './fixtures/bundle.js',
  },
  node: {
    fs: 'empty'
  },
  // resolve: {
  //   alias: {
  //     'https://unpkg.com/chai@4.1.2/chai.js': 'chai/chai.js'
  //   }
  // },
  // module: {
  //   rules: [
  //     {
  //       // load chai.js like a normal <script> tag
  //       test: require.resolve('chai/chai.js'),
  //       use: 'script-loader'
  //     }
  //   ]
  // },
}