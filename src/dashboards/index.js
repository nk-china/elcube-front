/**
 * 首页仪表盘
 */

import { GridLayout, GridItem } from "vue-grid-layout"

import NkDashboardHello from "./NkDashboardHello";
import NkDashboardLost from "./NkDashboardLost";


let install = function (Vue) {

    Vue.component("grid-layout",                GridLayout);
    Vue.component("grid-item",                  GridItem);

    Vue.component("nk-dashboard-hello",         NkDashboardHello);
    Vue.component("nk-dashboard-lost",          NkDashboardLost);
};

export default {install}