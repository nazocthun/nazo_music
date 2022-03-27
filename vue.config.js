const AutoImport = require('unplugin-auto-import/webpack')
const ElementPlus = require('unplugin-element-plus/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const path = require('path')
const resolve = dir => path.join(__dirname, dir)

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      ElementPlus({
        importStyle: 'sass',
        useSource: true
      }),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            exclude: new RegExp(/^(?!.*loading-directive).*$/),
            // Element Plus bug, https://github.com/element-plus/element-plus/issues/4855
            // temporary solution: https://blog.csdn.net/weixin_43245095/article/details/123105706
          })
        ],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        // dts: true,
      }),
    ],
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icon'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]'
      })
      
  }
})
