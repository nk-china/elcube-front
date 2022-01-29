const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const fs = require('fs');

const packageInfo = require("./package.json");
const version = packageInfo.version;
fs.writeFileSync(__dirname + '/src/apps/version.json',JSON.stringify({version}));

module.exports = {
  "pages": {
    "index": {
      "entry": process.env.ENTRY_INDEX||'./src/main.js',
    }
  },
  "runtimeCompiler":false,
  "productionSourceMap":false,
  "css":{
    //extract: false,
    "loaderOptions":{
      "less":{
        "javascriptEnabled":true
      }
    }
  },
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
      .rule('md')
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
      .loader("./src/utils/docs-loader.js")
      .end();

  },
  configureWebpack: (config)=>{

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns:[
          {
            flatten:true,
            from: __dirname.replace(/[\\]/g,'/')+'/src/apps/less/*.less',
            to: __dirname+'/dist/less/'
          },
          {
            flatten:true,
            from: __dirname.replace(/[\\]/g,'/')+'/src/apps/*.((le)|(sc))ss',
            to: __dirname+'/dist/'
          },
        ]
      })
    );

    if(config.mode === 'production'){

      if(process.env.EXTERNALS!=='false'){

        let externals = {}
        fs.readdirSync(__dirname + '/node_modules').forEach(function(item) { // 我没有使用es6
          if(item.indexOf('.') === 0) return
          if(item==='vue-codemirror') return
          if(item==='codemirror') return
          externals[item] = 'commonjs ' + item
        })

        config.externals = externals;
        config.output.libraryTarget = 'umd';

      }
    }


    if(process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.startsWith('build')){
      config.plugins.push(
          new CompressionWebpackPlugin({
            test: /\.js$|\.html$|\.css/, //匹配文件名
            threshold: 10240, //对超过10k的数据进行压缩
            deleteOriginalAssets: false //是否删除原文件
          })
      );
    }
  }
}
