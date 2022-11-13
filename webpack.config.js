const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require('path')

module.exports = (env) => {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'nosources-source-map' : 'eval-source-map',
    entry: path.resolve(__dirname, 'src', 'main.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.tsx$/,
          exclude: /node_modules/,
          use: 'babel-loader',
          resolve: {
            extensions: ['.tsx'],
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|svg)$/,
          type: 'asset/resource'
        }
      ]
    },
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        favicon: './public/favicon.ico'
      }),
      new MiniCssExtractPlugin(),
    ],
  }
}