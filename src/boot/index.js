

// 基础依赖
import Vuex from 'vuex';
import VueRouter from "vue-router";

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VXETable from "./VXETable";

import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css'

// 服务
import Http from "./Http";
import Router from './Router';
import Stores from '../store';

// UI组件
import NkComponent from "../components";
import NkCards from "../cards";
import NkCardLost from "../layout/NkCardLost";
import NkDashboards from "../dashboards";
import NkDocuments from "../documents";
import NkPages from "../pages";
import './nk.scss'

// 导出引用
import App from "../layout/NkApp";
import NkFormat from "../utils/NkFormat";
import NkUtil from "../utils/NkUtil";
import Mixin from "../cards/Mixin";
import MixinDef from "../cards/MixinDef";

import axios from 'axios';

function install(Vue){

  Vue.config.productionTip = false;
  Vue.prototype.$http = new Http(Vue);

  Vue.use(Vuex);
  Vue.use(VueRouter);

  Vue.use(Antd);
  Vue.use(VXETable);
  Vue.use(mavonEditor);

  Vue.use(NkComponent);
  Vue.use(NkCards);
  Vue.use(NkDashboards);
  Vue.use(NkDocuments);
  Vue.use(NkPages);


  Vue.component('nk-component-lost',NkCardLost);

  Vue.filter("nkNumber",NkFormat.nkNumber);
  Vue.filter("nkDatetime",NkFormat.nkDatetime);
  Vue.filter("nkDatetimeFriendly",NkFormat.nkDatetimeFriendly);
  Vue.filter("nkCurrency",NkFormat.nkCurrency);
  Vue.filter("nkPercent", NkFormat.nkPercent);
  Vue.filter("nkFromList",NkFormat.nkFromList);

  axios.get("/api/public/def/card/vueTemplates")
      .then(res=>{

        let modules = {
          Mixin,
          MixinDef,
          NkFormat,
          NkUtil
        }

        for(let componentName in res.data){
          if(res.data.hasOwnProperty(componentName)){
            NkUtil.componentLoader(componentName, res.data[componentName], modules)
          }
        }
      });
}

function NkVuexStore(moduleStores){
  return new Vuex.Store({
    modules:{
      ...Stores,
      ...moduleStores
    }
  })
}

function NkRouter(moduleRoutes,loginPage,defaultPage) {
  return new Router(VueRouter,[
      ...NkPages.routes,
      ...moduleRoutes
  ],loginPage,defaultPage);
}

let NkModule = {install};

export {

  NkModule,

  NkRouter,
  NkVuexStore,

  App,
  Mixin,
  MixinDef,
  NkFormat,
  NkUtil
}
