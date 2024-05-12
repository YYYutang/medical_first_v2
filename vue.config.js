const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
var webpack = require('webpack')


module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  chainWebpack: config => {
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' 
        },
        elementUI: {
          name: 'chunk-elementUI', 
          priority: 20, 
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
        },
      }
    })
    config.module
    .rule('js')
    .use('babel-loader')
    .loader('babel-loader')
    .tap(options => {
      // 修改它的选项...
      return options
    });
    config.module.rule('svg').exclude.add(path.join(__dirname, 'src/assets')).end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, 'src/assets'))
      .end()
      .use('svg-sprite')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  devServer: {
    // 代理配置
    proxy: {

      '/api': {
        // target: 'http://10.17.56.19:8087', // 我们要代理的地址
        target: 'http://10.16.80.16:8087',
        //  target: 'http://10.16.69.216:8088', 
        // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
        changeOrigin: true,
        // target: 'http://localhost:8088',
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),
      new SpeedMeasurePlugin(),
      new BundleAnalyzerPlugin()
    ]
  }
})
