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


import NkSpELEditor from "./components/NkSpELEditor";
import NkSpELTemplateEditor from "./components/NkSpELTemplateEditor";
import NkSpELView from "./components/NkSpELView";

import NkDashboardHello from "./components/NkDashboardHello";
import NkDashboardLost from "./components/NkDashboardLost";

import NkDefRegistry from "./pages/NkDefRegistry";
import NkDefScripts from "./pages/NkDefScripts";
import NkDefScriptDetail from "./pages/NkDefScriptDetail";

import NkDevOpsCache from "./pages/NkDevOpsCache";
import NkDevOpsDeploy from "./pages/NkDevOpsDeploy";

import NkSettingsAuthLimit from "./pages/NkSettingsAuthLimit";
import NkSettingsAuthPerm from "./pages/NkSettingsAuthPerm";
import NkSettingsAuthGroup from "./pages/NkSettingsAuthGroup";
import NkSettingsMenus from "./pages/NkSettingsMenus";

import NkSettingsAccounts from "./pages/NkSettingsAccounts";
import NkSettingsAccountDetail from "./pages/NkSettingsAccountDetail";

import NkPageDataTable from "./pages/NkPageDataTable";

import {GridItem, GridLayout} from "vue-grid-layout";

const install = function (Vue) {

  Vue.component("grid-layout",                GridLayout);
  Vue.component("grid-item",                  GridItem);

  Vue.component("nk-dashboard-hello",         NkDashboardHello);
  Vue.component("nk-dashboard-lost",          NkDashboardLost);

  Vue.component('nk-sp-el-editor',            NkSpELEditor);
  Vue.component('nk-sp-el-template-editor',   NkSpELTemplateEditor);
  Vue.component('nk-sp-el-view',              NkSpELView);
};

const routes = [
  {
    name: "自定义检索",
    path: 'q',
    children: [
      {
        name: "检索",
        path: ':id',
        component: NkPageDataTable,
      }
    ]
  },
  {
    name: "系统设置",
    path: "settings",
    children: [
      {
        name: "菜单配置",
        path: 'menus',
        component: NkSettingsMenus,
        meta:{
          title: "菜单配置",
        }
      },
      {
        name: "授权",
        path: "auth",
        children: [
          {
            name: "授权限制",
            path: "limit",
            component: NkSettingsAuthLimit,
            meta:{
              title: "授权限制",
            }
          },
          {
            name: "权限定义",
            path: "perm",
            component: NkSettingsAuthPerm,
            meta:{
              title: "权限定义",
            }
          },
          {
            name: "用户组",
            path: "group",
            component: NkSettingsAuthGroup,
            meta:{
              title: "用户组",
            }
          },
          {
            name: "账号管理",
            path: "accounts",
            component: NkSettingsAccounts,
            meta:{
              title: "用户账号",
            },
            children:[
              {
                name: "账号详情",
                path: ":mode/:username",
                component: NkSettingsAccountDetail,
                meta:{
                  title: "账号详情",
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "系统配置",
    path: "def",
    children: [
      {
        name:"基础配置",
        path: 'base',
        component: NkDefRegistry,
        meta:{
          title: "基础配置",
        }
      },
      {
        name: "组件",
        path: 'component',
        component: NkDefScripts,
        children: [
          {
            name: "组件编辑器",
            path: ':mode/:component/:version',
            component: NkDefScriptDetail
          },
          {
            name: "新建组件",
            path: ':mode',
            component: NkDefScriptDetail
          },
        ]
      },
      {
        name:"部署",
        path: 'deploy',
        component: NkDevOpsDeploy,
        meta:{
          title: "部署",
        }
      },
    ]
  },
  {
    name: "运维",
    path: 'devops',
    children: [
      {
        name: "数据缓存",
        path: 'cache',
        component: NkDevOpsCache,
        meta:{
          title: "数据缓存",
        }
      },
    ]
  }
];

export default {
  install,
  routes,
  sfc: {}
}

