const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.[hash].js',
    publicPath: '/',
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '/src'),
    ],
    alias: {
      SRC: path.resolve(__dirname, '/src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  externals: {
    OAuth: JSON.stringify(require('./config/oauth.js')),
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
