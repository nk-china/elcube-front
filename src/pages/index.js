
/**
 * 页面
 */
import NkPageTasks from "./task/NkPageTasks";
import NkPageDocs from "./doc/NkPageDocs";
import NkPageDocDetail from "./doc/NkPageDocDetail";
import NkPageDocDetailDiff from "./doc/NkPageDocDetailDiff";
import NkPageCustomQuery from "./doc/NkPageCustomQuery";
import NkCard from "./components/NkCard";


/**
 * 设置界面
 */
import NkSettingsAuthLimit from "./settings/NkSettingsAuthLimit";
import NkSettingsAuthPerm from "./settings/NkSettingsAuthPerm";
import NkSettingsAuthGroup from "./settings/NkSettingsAuthGroup";

/**
 * 配置页面
 */
import NkDefDocs from "./doc/NkDefDocs";
import NkDefDocType from "./doc/NkDefDocType";
// 脚本
import NkDefScripts from "./doc/NkDefScripts";
import NkDefScriptDetail from "./doc/NkDefScriptDetail";
import NkScriptLabel from "./doc/NkDefScriptLabel";
// 常量
import NkDefConstant from "./doc/NkDefConstant";
// 自定义搜索
import NkDefDeploy from "./devops/NkDefDeploy";
// 工作流
import NkPageProcessInstances from "./task/NkPageProcessInstances";
import NkPageProcessDetail from "./task/NkPageProcessDetail";
import NkDefBpmProcessDefinitions from "./task/NkDefBpmProcessDefinitions";
import NkDefBpmProcessDefinitionDetail from "./task/NkDefBpmProcessDefinitionDetail";
import NkDefBpmDesigner from "./task/NkDefBpmDesigner";
import NkDefBpmDeployments from "./task/NkDefBpmDeployments";// 待删除

import NkSettingsMenus from "./settings/NkSettingsMenus";

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

  /**
   * 页面组件，工作流页面需要嵌套的部分
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
        path: 'diff/:sourceDocId/:targetDocId',
        component: NkPageDocDetailDiff
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
        name: "工作流部署记录",
        path: 'bpm/process/deployments',
        component: NkDefBpmDeployments
      },
      {
        name: "工作流定义",
        path: 'bpm/process/definitions',
        component: NkDefBpmProcessDefinitions,
        children: [
          {
            name: "流程定义详情",
            path: 'detail/:id',
            component: NkDefBpmProcessDefinitionDetail
          },
          {
            name: "工作流设计器",
            path: 'designer',
            component: NkDefBpmDesigner,
            meta:{
              title: "工作流设计器",
            }
          },
        ]
      },
    ]
  },
  {
    name: "工作流",
    path: 'bpm',
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
    ]
  }
];

export default module

