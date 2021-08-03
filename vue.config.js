const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

//console.log(process)

module.exports = {
  "pages": {
    "index": {
      "entry": process.env.ENTRY_INDEX||'./src/main.js',
      "title": process.env.ENTRY_INDEX_TITLE||'交易金融管理系统',
    }
  },
  "runtimeCompiler":false,
  "productionSourceMap":false,
  "devServer": {
    "port": "7200",
    "proxy": {
      "^/api": {
        "target": process.env.DEV_SERVER_PROXY_TARGET,
        "ws": true,
        "changeOrigin": true,
        "pathRewrite":{
          "^/api": process.env.DEV_SERVER_PROXY_PATH
        }
      },
      "^/bpm": {
        "target": process.env.DEV_SERVER_PROXY_TARGET,
        "ws": true,
        "changeOrigin": true
      }
    },
    "overlay": {
      "warnings": true,
      "errors": true
    }
  },
  chainWebpack: config => {
    config.module.rule('md')
        .test(/\.md$/)
        .use('vue-loader')
          .loader('vue-loader')
        .end()
        .use('vue-markdown-loader')
          .loader('vue-markdown-loader/lib/markdown-compiler')
          .tap(() => {
            return {
              raw: true
            }
          })
        .end()
  },
  configureWebpack: (config)=>{

    if(process.env.npm_lifecycle_event.startsWith('build-')){
      config.mode='production';
    }

    // config.externals={
    //   'vue':'Vuex',
    //   'vue-router':'VueRouter',
    //   'vuex':'Vuex',
    //   'axios':'axios'
    // }

    config.plugins.push(
        new CopyWebpackPlugin({
          patterns:[
            { from: __dirname.replace(/[\\]/g,'/')+'/src/**',      to: __dirname+'/dist/' }
          ]
        }),
        new CompressionWebpackPlugin({
          test: /\.js$|\.html$|\.css/, //匹配文件名
          threshold: 10240, //对超过10k的数据进行压缩
          deleteOriginalAssets: false //是否删除原文件
        })
    );
  }
}
