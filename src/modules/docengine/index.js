import NkDoc from "./StateNkDoc";


import Mixin from "./cards/Mixin";
import MixinDef from "./cards/MixinDef";
import NkCardLost from "./cards/NkCardLost";
import NkDynamicForm from "./cards/NkDynamicForm";
import NkDynamicFormDef from "./cards/NkDynamicFormDef";

import NkScriptLabel from "./components/NkDefScriptLabel";
import NkCard from "./components/NkCard";
import NkDefCard from "./components/NkDefCard";
import NkDocSelectModal from "./components/NkDocSelectModal";
import NkDocSelectEditor from "./components/NkDocSelectEditor";
import NkStandardCardDefTable from "./components/NkStandardCardDefTable";

import NkPageDocs from "./page/NkPageDocs";
import NkPageDocDetail from "./page/NkPageDocDetail";
import NkPageDocDetailDiff from "./page/NkPageDocDetailDiff";

import NkDefDocs from "./page/NkDefDocs";
import NkDefDocType from "./page/NkDefDocType";

import NkDevOpsDataSync from "./page/NkDevOpsDataSync";

/**
 * Vue 模块对象
 * @type {null}
 */
const module = Object.create(null);
module.stores = {NkDoc};

module.sfc = {Mixin, MixinDef}
module.install = function (Vue) {

  /**
   * 通用组件
   */
  Vue.component('nk-script-label',NkScriptLabel);
  Vue.component('nk-card',NkCard);
  Vue.component('nk-def-card',NkDefCard);
  Vue.component('NkDynamicForm',NkDynamicForm);
  Vue.component('NkDynamicFormDef',NkDynamicFormDef);
  Vue.component('nk-doc-select-editor',NkDocSelectEditor);
  Vue.component('nk-doc-select-modal',NkDocSelectModal);
  Vue.component('nk-standard-card-def-table',NkStandardCardDefTable);
  Vue.component('nk-component-lost',NkCardLost);
};

module.routes = [
  {
    name: "单据",
    path: 'docs',
    component: NkPageDocs,
    children: [
      {
        name: "单据详情",
        path: ':mode/:docId',
        component: NkPageDocDetail,
        props:true,
      },
      {
        name: "单据对比",
        path: 'diff/:leftId/:rightId',
        component: NkPageDocDetailDiff
      }
    ]
  },
  {
    name: "单据类型",
    path: 'def/doc',
    component: NkDefDocs,
    children: [
      {
        name: "单据类型配置详情",
        path: ':mode',
        component: NkDefDocType,
        meta:{
          title: "配置详情",
        }
      },
      {
        name: "单据类型配置编辑",
        path: ':mode/:type/:version',
        component: NkDefDocType,
        meta:{
          title: "配置详情",
        }
      }
    ]
  },
  {
    name: "数据同步",
    path: 'devops/sync',
    component: NkDevOpsDataSync,
    meta:{
      title: "数据同步",
    }
  },
];

export default module

