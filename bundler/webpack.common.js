const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = (env, argv) => {
  return {
    entry: path.resolve(__dirname, '../src/script.js'),
    output:
    {
      filename: 'bundle.[contenthash].js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: argv.mode === 'production' ? '/threejs-pixel-river-example/' : '/'
    },
    devtool: 'source-map',
    plugins:
      [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../src/index.html'),
          minify: true,
          favicon: './assets/favicon/favicon.png',
          meta: {}
        }),
        new MiniCSSExtractPlugin()
      ],
    module:
    {
      rules:
        [
          // HTML
          {
            test: /\.(html)$/,
            use: ['html-loader']
          },

          // JS
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use:
              [
                'babel-loader'
              ]
          },

          // CSS
          {
            test: /\.css$/,
            use:
              [
                MiniCSSExtractPlugin.loader,
                'css-loader'
              ]
          },

          // Images
          {
            test: /\.(jpg|png|gif|svg|gltf|bin|ico)$/,
            use:
              [
                {
                  loader: 'file-loader',
                  options:
                  {
                    outputPath: 'assets/images/',
                    name: '[name].[ext]'
                  }
                }
              ]
          },

          // Shaders
          {
            test: /\.(glsl)$/,
            exclude: '/node_modules/',
            use:
              [
                'raw-loader'
              ]
          },

          // Fonts
          {
            test: /\.(ttf|eot|woff|woff2)$/,
            use:
              [
                {
                  loader: 'file-loader',
                  options:
                  {
                    outputPath: 'assets/fonts/'
                  }
                }
              ]
          }
        ]
    }
  }
}
