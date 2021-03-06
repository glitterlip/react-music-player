const path = require('path')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const HOST = '0.0.0.0'
const PORT = 8081

const getPublicPath = () => {
  if (!!process.env.NETLIFY || process.env.NODE_ENV !== 'production') {
    return '/'
  }
  return '/react-music-player'
}

module.exports = () => {
  const isDev = process.env.NODE_ENV === 'development'
  const options = {
    mode: process.env.NODE_ENV,
    entry: ['react-hot-loader/patch', path.join(__dirname, '../example')],
    output: {
      path: path.join(__dirname, '../example/dist'),
      filename: '[name].[hash:8].js',
      publicPath: getPublicPath(),
    },
    //模块加载器
    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
          exclude: '/node_modules/',
        },
        {
          test: /\.less$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: { minimize: false, sourceMap: isDev },
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: isDev,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' }, //loader 倒序执行  先执行 less-laoder
            {
              loader: 'css-loader',
              options: { minimize: false, sourceMap: isDev },
            },
          ],
        },
        {
          test: /\.(eot|ttf|svg|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name][hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    devtool: isDev ? 'source-map' : false,
    //自动补全后缀
    resolve: {
      enforceExtension: false,
      extensions: ['.js', '.jsx', '.json'],
      modules: [path.resolve('src'), path.resolve('.'), 'node_modules'],
    },
    externals: {
      async: 'commonjs async',
    },
    devServer: {
      contentBase: path.join(__dirname, '../example/'),
      host: HOST,
      compress: true,
      inline: true,
      port: PORT,
      historyApiFallback: true,
      hotOnly: true,
      stats: {
        color: true,
        errors: true,
        version: true,
        warnings: true,
        progress: true,
      },
    },
    plugins: [
      new OpenBrowserPlugin({
        url: `http:${HOST}:${PORT}/`,
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../example/index.html'),
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ],
  }
  return options
}
