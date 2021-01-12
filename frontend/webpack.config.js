const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry : './src/index.jsx',
  output : {
    path: path.join(__dirname, '/build'),
    filename : 'bundle.[hash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        resolve: {
          extensions: ['.js', '.jsx']
        },
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
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
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html'
    })
  ]
}
