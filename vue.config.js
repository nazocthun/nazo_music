const AutoImport = require('unplugin-auto-import/webpack')
const ElementPlus = require('unplugin-element-plus/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

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
})
