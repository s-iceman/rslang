const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    filename: '[hash].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  mode: mode,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
      {
        test: /\.(?:mp3|wav|ogg|mp4)$/i,
        type: "asset/resource",
        generator: {
          filename: 'assets/sound/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      title: 'RS-Lang',
      filename: 'index.html',
      favicon: 'src/favicon.ico',
    }),
    new CopyPlugin({
      patterns: [{ from: './src/assets', to: './assets' }],
    }),
  ],
  devServer: {
    static: './dist',
    port: 8383, // порт default 8080
    compress: true, // сжатие gzip
    hot: isDev, // при добавлении новых модулей сразу их подключать
    historyApiFallback: true, // использование history HTML5
    open: true, // открывать браузер при запуске
    client: {
      overlay: true, // оверлей при ошибках
    },
  },
  devtool: isDev && 'eval-source-map',
};
