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
    name: "???????????????",
    path: 'q',
    children: [
      {
        name: "??????",
        path: ':id',
        component: NkPageDataTable,
      }
    ]
  },
  {
    name: "????????????",
    path: "settings",
    children: [
      {
        name: "????????????",
        path: 'menus',
        component: NkSettingsMenus,
        meta:{
          title: "????????????",
        }
      },
      {
        name: "??????",
        path: "auth",
        children: [
          {
            name: "????????????",
            path: "limit",
            component: NkSettingsAuthLimit,
            meta:{
              title: "????????????",
            }
          },
          {
            name: "????????????",
            path: "perm",
            component: NkSettingsAuthPerm,
            meta:{
              title: "????????????",
            }
          },
          {
            name: "?????????",
            path: "group",
            component: NkSettingsAuthGroup,
            meta:{
              title: "?????????",
            }
          },
          {
            name: "????????????",
            path: "accounts",
            component: NkSettingsAccounts,
            meta:{
              title: "????????????",
            },
            children:[
              {
                name: "????????????",
                path: ":mode/:username",
                component: NkSettingsAccountDetail,
                meta:{
                  title: "????????????",
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "????????????",
    path: "def",
    children: [
      {
        name:"????????????",
        path: 'base',
        component: NkDefRegistry,
        meta:{
          title: "????????????",
        }
      },
      {
        name: "??????",
        path: 'component',
        component: NkDefScripts,
        children: [
          {
            name: "???????????????",
            path: ':mode/:component/:version',
            component: NkDefScriptDetail
          },
          {
            name: "????????????",
            path: ':mode',
            component: NkDefScriptDetail
          },
        ]
      },
      {
        name:"??????",
        path: 'deploy',
        component: NkDevOpsDeploy,
        meta:{
          title: "??????",
        }
      },
    ]
  },
  {
    name: "??????",
    path: 'devops',
    children: [
      {
        name: "????????????",
        path: 'cache',
        component: NkDevOpsCache,
        meta:{
          title: "????????????",
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

