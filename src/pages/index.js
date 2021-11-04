
import NkScriptLabel from "./doc/NkDefScriptLabel";
import NkCard from "./components/NkCard";
import NkDefCard from "./components/NkDefCard";
import NkDocSelectModal from "./components/NkDocSelectModal";
import NkDocSelectEditor from "./components/NkDocSelectEditor";
import NkSpELEditor from "./components/NkSpELEditor";
import NkSpELTemplateEditor from "./components/NkSpELTemplateEditor";
/**
 * 页面
 */
import NkPageTasks from "./task/NkPageTasks";
import NkPageDocs from "./doc/NkPageDocs";
import NkPageDocDetail from "./doc/NkPageDocDetail";
import NkPageDocDetailDiff from "./doc/NkPageDocDetailDiff";
import NkPageCustomQuery from "./data/NkPageCustomQuery";
import NkPageDataDiscover from "./data/NkPageDataDiscover";
import NkPageDataVisualize from "./data/NkPageDataVisualize";
import NkPageDataView from "./data/NkPageDataView";

/**
 * 设置界面
 */
import NkSettingsAuthLimit from "./settings/NkSettingsAuthLimit";
import NkSettingsAuthPerm from "./settings/NkSettingsAuthPerm";
import NkSettingsAuthGroup from "./settings/NkSettingsAuthGroup";
import NkSettingsMenus from "./settings/NkSettingsMenus";

/**
 * 配置页面
 */
import NkDefConstant from "./doc/NkDefConstant";
import NkDefScripts from "./doc/NkDefScripts";
import NkDefScriptDetail from "./doc/NkDefScriptDetail";
import NkDefDocs from "./doc/NkDefDocs";
import NkDefDocType from "./doc/NkDefDocType";
import NkDefBpmProcessDefinitions from "./task/NkDefBpmProcessDefinitions";
import NkDefBpmProcessDefinitionDetail from "./task/NkDefBpmProcessDefinitionDetail";
import NkDefBpmDesigner from "./task/NkDefBpmDesigner";
import NkDefBpmDeployments from "./task/NkDefBpmDeployments";// 待删除

import NkDefDmnDefinitions from "./task/NkDefDmnDefinitions";
import NkDefDmnDefinitionDetail from "./task/NkDefDmnDefinitionDetail";
import NkDefDmnDesigner from "./task/NkDefDmnDesigner";

import NkPageProcessInstances from "./task/NkPageProcessInstances";
import NkPageProcessDetail from "./task/NkPageProcessDetail";

/**
 * 运维页面
 */
import NkDevOpsDataSync from "./devops/NkDevOpsDataSync";
import NkDevOpsCache from "./devops/NkDevOpsCache";
import NkDefDeploy from "./devops/NkDefDeploy";
/**
 * Vue 模块对象
 * @type {null}
 */
const module = Object.create(null);
module.install = function (Vue) {

  /**
   * 通用组件
   */
  Vue.component('nk-script-label',NkScriptLabel);
  Vue.component('nk-card',NkCard);
  Vue.component('nk-def-card',NkDefCard);
  Vue.component('nk-doc-select-editor',NkDocSelectEditor);
  Vue.component('nk-doc-select-modal',NkDocSelectModal);
  Vue.component('nk-sp-el-editor',NkSpELEditor);
  Vue.component('nk-sp-el-template-editor',NkSpELTemplateEditor);

  /**
   * 页面组件，预览页面需要嵌套的部分
   */
  Vue.component('nk-page-doc-detail',NkPageDocDetail);
};

module.routes = [
  {
    name: "任务",
    path: 'tasks',
    component: NkPageTasks,
  },
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
    name: "数据",
    path: 'data',
    children: [
      {
        name: "发现",
        path: 'discover',
        component: NkPageDataDiscover,
        meta:{
          title: "数据发现",
        }
      },
      {
        name: "可视化",
        path: 'visualize',
        component: NkPageDataVisualize,
        meta:{
          title: "数据可视化",
        },
        children: [
          {
            name: "数据视图",
            path: 'view/:id',
            component: NkPageDataView,
            meta:{
              title: "数据视图",
            }
          },
        ]
      },
      {
        name: "数据报表",
        path: 'v/:id',
        component: NkPageCustomQuery,
      }
    ]
  },
  {
    name: "自定义检索",
    path: 'q',
    children: [
      {
        name: "检索",
        path: ':id',
        component: NkPageCustomQuery,
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
        name: "单据类型",
        path: 'doc',
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
        name: "脚本",
        path: 'script',
        component: NkDefScripts,
        children: [
          {
            name: "脚本编辑器",
            path: ':mode/:script/:version',
            component: NkDefScriptDetail
          },
          {
            name: "新建脚本",
            path: ':mode',
            component: NkDefScriptDetail
          },
        ]
      },
      {
        name:"常量",
        path: 'constant',
        component: NkDefConstant,
        meta:{
          title: "常量",
        }
      },
      {
        name:"部署",
        path: 'deploy',
        component: NkDefDeploy,
        meta:{
          title: "部署",
        }
      },
      {
        name: "流程部署记录",
        path: 'bpm/process/deployments',
        component: NkDefBpmDeployments
      },
      {
        name: "流程定义",
        path: 'bpm/process/definitions',
        component: NkDefBpmProcessDefinitions,
        children: [
          {
            name: "流程定义详情",
            path: 'detail/:id',
            component: NkDefBpmProcessDefinitionDetail
          },
          {
            name: "流程设计器",
            path: 'designer',
            component: NkDefBpmDesigner,
            meta:{
              title: "工作流设计器",
            }
          },
        ]
      },
      {
        name: "决策定义",
        path: 'dmn/definitions',
        component: NkDefDmnDefinitions,
        children: [
          {
            name: "决策定义详情",
            path: 'detail/:id',
            component: NkDefDmnDefinitionDetail
          },
          {
            name: "决策设计器",
            path: 'designer',
            component: NkDefDmnDesigner,
            meta:{
              title: "决策设计器",
            }
          },
        ]
      },
    ]
  },
  {
    name: "运维",
    path: 'devops',
    children: [
      {
        name: "流程实例",
        path: 'process/instances',
        component: NkPageProcessInstances,
        meta:{
          title: "流程实例",
        },
        children: [
          {
            name: "流程实例详情",
            path: 'detail/:id',
            component: NkPageProcessDetail
          },
        ]
      },
      {
        name: "数据同步",
        path: 'sync',
        component: NkDevOpsDataSync,
        meta:{
          title: "数据同步",
        }
      },
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

export default module

