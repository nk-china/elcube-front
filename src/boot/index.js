

// 基础依赖
import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n'
import VueRouter from "vue-router";

import Antd from 'ant-design-vue';
import VXETable from "./VXETable";

import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css'

// 服务
import Router from './Router';
import Stores from '../store';
import Http from "./Http";

// UI组件
import NkComponent from "../components";
import NkCards from "../cards";
import NkCardLost from "../layout/NkCardLost";
import NkDashboards from "../pages/data/dashboards";
import NkDocuments from "../documents";
import NkPages from "../pages";
import NkData from "../data";

// 导出引用
import App from "../layout/NkApp";
import Mixin from "../cards/Mixin";
import MixinDef from "../cards/MixinDef";
import MixinSortable from "../utils/MixinSortable";
import NkFormat from "../utils/NkFormat";
import NkUtil from "../utils/NkUtil";
import {loadModule} from "vue3-sfc-loader/dist/vue2-sfc-loader";
import moment from "moment";
import numeral from "numeral";
import * as ant from 'ant-design-vue';
import eval5 from "eval5";
import * as g2plot from '@antv/g2plot';
import NkPageDefault from "@/pages/NkPageDefault";
import NkLogin from "@/layout/NkLogin";
import NkLogo from "@/components/NkLogo";

import StateUI from "@/store/StateUI";
import StateDataV from "@/store/StateDataV";

Vue.config.productionTip = false;
Vue.prototype.$http = new Http(Vue);

Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(VueRouter);

Vue.use(Antd);
Vue.use(VXETable);
Vue.use(mavonEditor);

Vue.use(NkComponent);
Vue.use(NkCards);
Vue.use(NkDashboards);
Vue.use(NkDocuments);
Vue.use(NkPages);
Vue.use(NkData);


Vue.component('nk-component-lost',NkCardLost);

Vue.filter("nkNumber",NkFormat.nkNumber);
Vue.filter("nkDatetime",NkFormat.nkDatetime);
Vue.filter("nkDatetimeFriendly",NkFormat.nkDatetimeFriendly);
Vue.filter("nkDatetimeISO",NkFormat.nkDatetimeISO);
Vue.filter("nkCurrency",NkFormat.nkCurrency);
Vue.filter("nkPercent", NkFormat.nkPercent);
Vue.filter("nkFromList",NkFormat.nkFromList);

Vue.mixin({
  beforeCreate: function () {
    const docs = this.$options.__docs
    if (docs) {
      this.$docs = docs;
    }
  }
});

let globalOptions = {
  appName:    "TS5统一开发平台",
  logo:       NkLogo,
  loginPage:  NkLogin,
  defaultPage:NkPageDefault,
  dataV:      {
    themes:[{
      value:'default',label:'默认'
    }]
  }
};

const modules = {
  Mixin,
  MixinDef,
  MixinSortable,
  NkFormat,
  NkUtil,
};

const i18n = new VueI18n({
  locale: 'zh_CN', // 设置语言环境
});

function NkVuexStore(moduleStores){
  return new Vuex.Store({
    modules:{
      ...Stores,
      ...moduleStores
    }
  })
}

function NkRouter(moduleRoutes) {
  return new Router(VueRouter,[
      ...NkPages.routes,
      ...moduleRoutes
  ],globalOptions.loginPage,globalOptions.defaultPage);
}


function componentLoader(componentName, template, modules) {

  return Vue.component(componentName,() => {

    return new Promise((resolve,reject)=>{
      let i18n,markdown;
      loadModule(
        componentName+".vue",
        {
          moduleCache: {
            vue: Vue,
            "ant-design-vue":ant,
            moment,
            numeral,
            eval5,
            'nk-ts5-platform': modules,
            '@antv/g2plot': g2plot,
            ...modules
          },
          getFile() {
            return template;
          },
          addStyle(textContent) {
            document.head.append(Object.assign(document.createElement('style'), { textContent }));
          },
          customBlockHandler(block) {
            if ( block.type === 'i18n' ){
              i18n = block.content;
            }
            if ( block.type === 'docs' ){
              markdown = block.content;
            }
          }
        }
      ).then(component=>{
        if(i18n){
          component.__i18n = [i18n];
        }
        if(markdown){
          component.__docs = markdown.trim();
        }
        resolve(component);
      }).catch((e)=>{
        console.log(e);
        reject(e);
      });
    });
  });
}

function loadVueTemplate(componentName, template){
  return componentLoader(componentName, template, modules)
}

function reloadVueResources(){

  return new Promise((resolve,reject)=>{
    Vue.prototype.$http.instanceNone.get("/api/def/resources/vue")
      .then(res=>{
        let count = 0;
        for(let componentName in res.data){
          if(res.data.hasOwnProperty(componentName)){
            componentLoader(componentName, res.data[componentName], modules, i18n)
          }
          count ++;
        }
        resolve({
          Vue,
          count,
          data:res.data
        });
      }).catch(reject);
  })
}

function NKStarter(options){
  globalOptions = Object.assign(globalOptions,options);

  StateUI.state.logo = globalOptions.logo || NkLogo;
  StateUI.state.appName = globalOptions.appName;

  StateDataV.state.themes = globalOptions.dataV.themes;

  return new Promise((resolve, reject)=>{
    reloadVueResources()
        .then(()=>{
           resolve({
             Vue,
             App,
             NkRouter,
             NkVuexStore,
             i18n
           });
        }).catch(reject);
  })
}

export {

  NkRouter,
  NkVuexStore,

  App,
  Mixin,
  MixinDef,
  MixinSortable,
  NkFormat,
  NkUtil,

  i18n,

  reloadVueResources,
  loadVueTemplate,

  NKStarter
}
