
import Vue from 'vue';
import Vuex from "vuex";
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";
import * as Antd from "ant-design-vue";
import VXETable from "./js/VXETable";

import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

// export to sfc
import * as g2plot from "@antv/g2plot";
import eval5 from "eval5";
import moment from "moment";
import numeral from "numeral";
import markdownIt from "markdown-it";
import less from "less";

// 服务
import Http from "./js/Http";
import Router from './js/Router';
import SfcLoader from "./js/SfcLoader";
import * as Stores from './stores';

import App from "./NkApp";
import NkLogin from "./NkLogin";

import LayoutComponent from '../modules/components';
import Kernel from '../modules/kernel';
import NkPageDefault from "../modules/kernel/pages/NkPageDefault";


import NkFormat from "../utils/NkFormat";
import NkUtil from "../utils/NkUtil";
import MixinSortable from "../utils/MixinSortable";

Vue.config.productionTip = false;
Vue.prototype.$http = new Http(Vue);

Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(VueRouter);

Vue.use(Antd);
Vue.use(VXETable);
Vue.use(mavonEditor);

Vue.use(LayoutComponent);
Vue.use(Kernel);

Vue.mixin({
    beforeCreate: function () {
        const docs = this.$options.__docs
        if (docs) {
            this.$docs = docs;
        }
    }
});

Vue.filter("nkNumber",NkFormat.nkNumber);
Vue.filter("nkDatetime",NkFormat.nkDatetime);
Vue.filter("nkDatetimeFriendly",NkFormat.nkDatetimeFriendly);
Vue.filter("nkDatetimeISO",NkFormat.nkDatetimeISO);
Vue.filter("nkCurrency",NkFormat.nkCurrency);
Vue.filter("nkPercent", NkFormat.nkPercent);
Vue.filter("nkFromList",NkFormat.nkFromList);

// 开始初始化TS5

let globalOptions = {
    appName:    "TS5统一开发平台",
    logo:       'nk-logo',
    loginPage:  NkLogin,
    defaultPage:NkPageDefault,
    dataV:      {
        themes:[{
            value:'default',label:'默认'
        }]
    },
    exportModules:[]
};

// 加载各个模块，并将模块的routes和stores合并
let routes      = Kernel.routes,
    stores      = Stores,
    sfc         = {
        MixinSortable,
        NkFormat,
        NkUtil
    };


const use = (module)=>{
    Vue.use(module);

    if(module.routes)
        routes = [...routes,...module.routes]

    if(module.stores)
        stores = {...stores,...module.stores}

    if(module.sfc)
        sfc    = {...sfc,    ...module.sfc}

    return o;
}



const run = (options)=>{

    globalOptions = Object.assign(globalOptions,options);

    Stores.UI.state.logo = globalOptions.logo || 'nk-logo';
    Stores.UI.state.appName = globalOptions.appName;

    const router = new Router(VueRouter,routes,globalOptions.loginPage,globalOptions.defaultPage);
    const store = new Vuex.Store({ modules:stores })
    const i18n = new VueI18n({
        locale: 'zh_CN', // 设置语言环境
    });
    const sfcLoader = SfcLoader(Vue, {
        'vue'             : Vue,
        'ant-design-vue'  : Antd,
        '@antv/g2plot'    : g2plot,
        'eval5'           : eval5,
        'moment'          : moment,
        'numeral'         : numeral,
        'markdown-it'     : markdownIt,
        'less'            : less,

        'nk-ts5-platform' : sfc,
        'nk-ts5-kernel'   : sfc,
        'nk'              : sfc,

        ...sfc
    }, i18n, Vue.prototype.$http);
    Vue.prototype.$sfc = sfcLoader;

    return new Promise((resolve,reject)=>{
        sfcLoader.reloadVueResources()
            .then(()=>{
                resolve({
                    Vue,
                    options: {
                        router,
                        store,
                        i18n,
                        render  : h => h(App),
                    }
                });
            }).catch(reject);
    })
}

const o = {
    use,
    run,
    ...sfc
}

export default o