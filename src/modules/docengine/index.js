/*
 * 	This file is part of EAsis.
 *	EAsis is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	EAsis is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
 */
import NkDoc from "./StateNkDoc";


import Mixin from "./cards/Mixin";
import MixinDef from "./cards/MixinDef";
import NkCardLost from "./cards/NkCardLost";
import NkDynamicForm from "./cards/NkDynamicForm";
import NkDynamicFormDef from "./cards/NkDynamicFormDef";
import NkDynamicGrid from "./cards/NkDynamicGrid";
import NkDynamicGridDef from "./cards/NkDynamicGridDef";
import NkLinkageForm from "./cards/NkLinkageForm";
import NkLinkageFormDef from "./cards/NkLinkageFormDef";

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

module.sfc = {
  Mixin,
  MixinDef,
  NkDynamicForm,
  NkDynamicFormDef,
  NkDynamicGrid,
  NkDynamicGridDef
}
module.install = function (Vue) {

  /**
   * 通用组件
   */
  Vue.component('nk-script-label',NkScriptLabel);
  Vue.component('nk-card',NkCard);
  Vue.component('nk-def-card',NkDefCard);
  Vue.component('NkDynamicForm',NkDynamicForm);
  Vue.component('NkDynamicFormDef',NkDynamicFormDef);
  Vue.component('NkDynamicGrid',NkDynamicGrid);
  Vue.component('NkDynamicGridDef',NkDynamicGridDef);
  Vue.component('NkLinkageForm',NkLinkageForm);
  Vue.component('NkLinkageFormDef',NkLinkageFormDef);
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

