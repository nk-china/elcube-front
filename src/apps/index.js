/*
 * 	This file is part of ELCube.
 *	ELCube is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCube is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
 */

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
import NkErrorModal from "./NkErrorModal";

import LayoutComponent from '../modules/components';

import Kernel from '../modules/kernel';
// import Doc    from '../modules/docengine';
// import Task   from '../modules/task';
// import Data   from '../modules/dataengine';

import NkPageDefault from "../modules/kernel/pages/NkPageDefault";


import NkFormat from "../utils/NkFormat";
import NkUtil from "../utils/NkUtil";
import MixinSortable from "../utils/MixinSortable";

import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import "codemirror/addon/hint/show-hint.css";
import "codemirror/theme/ambiance.css";

require("codemirror/mode/sql/sql.js");
require("codemirror/mode/vue/vue.js");
require("codemirror/mode/groovy/groovy.js");
require("codemirror/mode/javascript/javascript.js");

require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/anyword-hint");

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
Vue.component("nk-error-modal", NkErrorModal);
Vue.component("codemirror",codemirror);

Vue.mixin({
    beforeCreate: function () {
        const docs = this.$options.__docs;
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

// 开始初始化

let globalOptions = {
    appName:    "ELCube企业级快速开发模型",
    logo:       'nk-logo',
    loginPage:  NkLogin,
    defaultPage:NkPageDefault,
    enableSfc:  true,
    sfc:        {}
};

// 加载各个模块，并将模块的routes和stores合并
let routes      = Kernel.routes,
    stores      = Stores,
    sfc         = {
        MixinSortable,
        NkFormat,
        NkUtil
    };

export {
    MixinSortable,
    NkFormat,
    NkUtil
}


const use = (module, options)=>{

    if(module.install)
        module.install(Vue, options);

    if(module.routes)
        routes = [...routes,...module.routes];

    if(module.stores)
        stores = {...stores,...module.stores};

    if(module.sfc)
        sfc    = {...sfc,    ...module.sfc};

    return o;
};



const run = (options)=>{

    Object.keys(options).forEach(key=>{if(options[key]===undefined)delete options[key];});

    globalOptions = Object.assign(globalOptions,options);

    Stores.UI.state.logo        = globalOptions.logo || 'nk-logo';
    Stores.UI.state.appName     = globalOptions.appName;
    Stores.UI.state.fixedMenu   = globalOptions.fixedMenu === undefined || globalOptions.fixedMenu;

    const router = new Router(VueRouter,routes,globalOptions.loginPage,globalOptions.defaultPage);
    const store = new Vuex.Store({ modules:stores });
    const i18n = new VueI18n({
        locale: 'zh_CN', // 设置语言环境
    });

    if(globalOptions.iconFont){
        Object.keys(globalOptions.iconFont)
            .forEach(key=>{
                const IconFont = Antd.Icon.createFromIconfontCN({
                    scriptUrl: globalOptions.iconFont[key],
                });
                Vue.component(key,IconFont);
            })
    }

    const sfcLoader = new SfcLoader(Vue, {
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
        'elcube'          : sfc,

        ...sfc,
        ...globalOptions.sfc
    }, globalOptions.enableSfc);
    Vue.prototype.$sfc = sfcLoader;

    return new Promise((resolve)=>{
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
            }).catch(()=>{
                resolve({
                    Vue,
                    options: {
                        router,
                        store,
                        i18n,
                        render  : h => h(App),
                    }
                });
            });
    })
};

const o = {
    use,
    run,
    ...sfc
};

export default o
