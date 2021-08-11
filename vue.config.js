const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

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
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();
    config.module
      .rule("docs")
      .resourceQuery(/blockType=docs/)
      .type('javascript/auto')
      .use("docs")
      .loader("./src/boot/docs-loader.js")
      .end();
  },
  configureWebpack: (config)=>{

    if(process.env.npm_lifecycle_event.startsWith('build-')){
      config.mode='production';
    }

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
